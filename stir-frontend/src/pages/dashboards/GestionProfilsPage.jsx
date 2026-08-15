import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, setProfilEmploye } from "../../services/userAdminService";
import "./GestionProfilsPage.css";

const NIVEAUX = ["Technicien", "Ingénieur", "Cadre", "Manager"];
const SPECIALITES = ["Développement", "DevOps", "Cloud", "Réseau", "Sécurité", "Data", "Support", "Autre"];

export default function GestionProfilsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editValues, setEditValues] = useState({});
  const [savingId, setSavingId] = useState(null);
  const navigate = useNavigate();

  const charger = () => {
    getAllUsers()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setUsers(data);
      })
      .catch(() => setError("Impossible de charger la liste des employés."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    charger();
  }, []);

  const getValue = (u, field, fallback) =>
    editValues[u.id]?.[field] ?? u[field] ?? fallback;

  const handleChange = (id, field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (u) => {
    const edited = editValues[u.id] || {};
    setSavingId(u.id);
    try {
      const payload = {
        anneesExperience: Number(edited.anneesExperience ?? u.anneesExperience ?? 0),
        niveauPoste: edited.niveauPoste ?? u.niveauPoste ?? "",
        specialite: edited.specialite ?? u.specialite ?? "",
        estManager: edited.estManager ?? u.estManager ?? false,
        tailleEquipe: edited.estManager
          ? Number(edited.tailleEquipe ?? u.tailleEquipe ?? 0)
          : null,
      };
      const updated = await setProfilEmploye(u.id, payload);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, ...payload } : x)));
      setEditValues((prev) => ({ ...prev, [u.id]: {} }));
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="profils-page">
      <button type="button" className="back-btn" onClick={() => navigate("/admin/dashboard")}>
        ← Retour
      </button>

      <h1 className="page-title">Profils employés — expérience & spécialité</h1>
      <p className="profils-subtitle">
        Ces informations permettent au modèle de recommandation de sélectionner les employés
        adaptés directement dans la base de données, plutôt que dans un fichier externe.
      </p>

      {loading && <p>Chargement...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && (
        <div className="profils-list">
          {users.map((u) => {
            const isManager = getValue(u, "estManager", false);
            return (
              <div className="profil-card" key={u.id}>
                <div className="profil-card-header">
                  <strong>{u.firstName} {u.lastName}</strong>
                  <span className="profil-dept">{u.department || "—"}</span>
                </div>

                <div className="profil-fields">
                  <label>
                    Années d'expérience
                    <input
                      type="number"
                      min="0"
                      value={getValue(u, "anneesExperience", "")}
                      onChange={(e) => handleChange(u.id, "anneesExperience", e.target.value)}
                    />
                  </label>

                  <label>
                    Niveau de poste
                    <select
                      value={getValue(u, "niveauPoste", "")}
                      onChange={(e) => handleChange(u.id, "niveauPoste", e.target.value)}
                    >
                      <option value="">Sélectionner</option>
                      {NIVEAUX.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Spécialité
                    <select
                      value={getValue(u, "specialite", "")}
                      onChange={(e) => handleChange(u.id, "specialite", e.target.value)}
                    >
                      <option value="">Sélectionner</option>
                      {SPECIALITES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isManager}
                      onChange={(e) => handleChange(u.id, "estManager", e.target.checked)}
                    />
                    Encadre une équipe
                  </label>

                  {isManager && (
                    <label>
                      Taille de l'équipe
                      <input
                        type="number"
                        min="1"
                        value={getValue(u, "tailleEquipe", "")}
                        onChange={(e) => handleChange(u.id, "tailleEquipe", e.target.value)}
                      />
                    </label>
                  )}
                </div>

                <button
                  className="profil-save-btn"
                  disabled={savingId === u.id}
                  onClick={() => handleSave(u)}
                >
                  {savingId === u.id ? "..." : "Enregistrer"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}