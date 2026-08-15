import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createActivite } from "../../services/activiteService";
import "./ActivitesPage.css";

const DEPARTMENTS = ["informatique", "mecanique", "civil", "electrique"];

export default function CreerActivitePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titre: "",
    description: "",
    type: "FORMATION",
    lieu: "",
    dateDebut: "",
    dateFin: "",
    placesDisponibles: "",
    departmentsCibles: [],
    competencesRequises: "",
    nombreEmployesSouhaite: 5,
    conditions: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleDepartment = (dep) => {
    setForm((prev) => ({
      ...prev,
      departmentsCibles: prev.departmentsCibles.includes(dep)
        ? prev.departmentsCibles.filter((d) => d !== dep)
        : [...prev.departmentsCibles, dep],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        competencesRequises: form.competencesRequises
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        nombreEmployesSouhaite: Number(form.nombreEmployesSouhaite) || 5,
      };
      await createActivite(payload);
      navigate("/activites");
    } catch (err) {
      setError("Erreur lors de la création de l'activité.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activites-page">
      <button type="button" className="back-btn" onClick={() => navigate("/activites")}>
        ← Retour aux activités
      </button>

      <h1>Créer une activité</h1>
      <form onSubmit={handleSubmit} className="creer-activite-form">
        <label>
          Titre
          <input
            required
            value={form.titre}
            onChange={(e) => setForm({ ...form, titre: e.target.value })}
          />
        </label>

        <label>
          Description
          <textarea
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>

        <label>
          Type
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="FORMATION">Formation</option>
            <option value="SEMINAIRE">Séminaire</option>
            <option value="ATELIER">Atelier</option>
            <option value="CONFERENCE">Conférence</option>
          </select>
        </label>

        <label>
          Compétences requises (séparées par des virgules)
          <input
            placeholder="Python, Angular, Docker"
            value={form.competencesRequises}
            onChange={(e) =>
              setForm({ ...form, competencesRequises: e.target.value })
            }
          />
        </label>

        <label>
          Conditions requises
          <textarea
            placeholder="Ex: 5 ans d'expérience minimum, niveau intermédiaire en Angular..."
            value={form.conditions}
            onChange={(e) => setForm({ ...form, conditions: e.target.value })}
          />
        </label>

        <label>
          Nombre d'employés souhaité
          <input
            type="number"
            min="1"
            value={form.nombreEmployesSouhaite}
            onChange={(e) =>
              setForm({ ...form, nombreEmployesSouhaite: e.target.value })
            }
          />
        </label>

        <label>
          Lieu
          <input
            value={form.lieu}
            onChange={(e) => setForm({ ...form, lieu: e.target.value })}
          />
        </label>

        <div className="form-row">
          <label>
            Date début
            <input
              type="date"
              required
              value={form.dateDebut}
              onChange={(e) => setForm({ ...form, dateDebut: e.target.value })}
            />
          </label>
          <label>
            Date fin
            <input
              type="date"
              required
              value={form.dateFin}
              onChange={(e) => setForm({ ...form, dateFin: e.target.value })}
            />
          </label>
        </div>

        <label>
          Places disponibles
          <input
            type="number"
            min="1"
            value={form.placesDisponibles}
            onChange={(e) =>
              setForm({ ...form, placesDisponibles: e.target.value })
            }
          />
        </label>

        <fieldset>
          <legend>Métiers ciblés</legend>
          <div className="departments-checkboxes">
            {DEPARTMENTS.map((dep) => (
              <label key={dep} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.departmentsCibles.includes(dep)}
                  onChange={() => toggleDepartment(dep)}
                />
                {dep}
              </label>
            ))}
          </div>
        </fieldset>

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="btn-creer-activite" disabled={loading}>
          {loading ? "Création..." : "Créer l'activité"}
        </button>
      </form>
    </div>
  );
}