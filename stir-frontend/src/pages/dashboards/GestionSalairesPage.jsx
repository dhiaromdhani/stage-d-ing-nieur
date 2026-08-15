import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, setSalaireEmploye } from "../../services/userAdminService";
import "./GestionSalairesPage.css";

export default function GestionSalairesPage() {
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
        setUsers(data.filter((u) => u.role === "ROLE_EMPLOYEE" || u.role?.startsWith?.("ROLE_")));
      })
      .catch(() => setError("Impossible de charger la liste des employés."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    charger();
  }, []);

  const handleChange = (id, value) => {
    setEditValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id) => {
    const value = editValues[id];
    if (!value || Number(value) <= 0) {
      alert("Entrez un salaire valide.");
      return;
    }
    setSavingId(id);
    try {
      await setSalaireEmploye(id, Number(value));
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, salaireMensuel: Number(value) } : u))
      );
      setEditValues((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="salaires-page">
      <button type="button" className="back-btn" onClick={() => navigate("/rh/dashboard")}>
        ← Retour
      </button>

      <h1 className="page-title">Gestion des salaires</h1>
      <p className="salaires-subtitle">
        Renseignez le salaire mensuel des employés pour permettre le calcul de conversion congé → argent.
      </p>

      {loading && <p>Chargement...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && (
        <div className="salaires-table-card">
          <table className="salaires-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Salaire actuel (DT)</th>
                <th>Nouveau salaire</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.firstName} {u.lastName}</td>
                  <td>{u.email}</td>
                  <td>{u.role?.replace("ROLE_", "")}</td>
                  <td>
                    {u.salaireMensuel ? (
                      <span className="salaire-badge">{u.salaireMensuel.toFixed(3)} DT</span>
                    ) : (
                      <span className="salaire-empty">Non renseigné</span>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      step="0.001"
                      placeholder="Ex: 1200"
                      value={editValues[u.id] || ""}
                      onChange={(e) => handleChange(u.id, e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      className="save-salaire-btn"
                      disabled={savingId === u.id}
                      onClick={() => handleSave(u.id)}
                    >
                      {savingId === u.id ? "..." : "Enregistrer"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}