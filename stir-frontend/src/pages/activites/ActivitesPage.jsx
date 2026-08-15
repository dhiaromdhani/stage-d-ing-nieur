import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllActivites, confirmerAffectation } from "../../services/activiteService";
import { postuler, getMesCandidatures } from "../../services/candidatureService";
import { IconGraduationCap, IconUsers, IconWrench, IconMic, IconMapPin, IconCalendar, IconTarget, IconX, IconCheck } from "../../components/Icons/Icons";
import "./ActivitesPage.css";

const TYPES = [
  { key: "FORMATION", label: "Formation", Icon: IconGraduationCap },
  { key: "SEMINAIRE", label: "Séminaire", Icon: IconUsers },
  { key: "ATELIER", label: "Atelier", Icon: IconWrench },
  { key: "CONFERENCE", label: "Conférence", Icon: IconMic },
];

function getDashboardPath() {
  const role = localStorage.getItem("role");
  const routes = {
    ROLE_EMPLOYEE: "/employee",
    ROLE_CHEF: "/chef/dashboard",
    ROLE_SOUS_DIRECTEUR: "/sous-directeur/dashboard",
    ROLE_DIRECTEUR: "/directeur/dashboard",
    ROLE_RH: "/rh/dashboard",
    ROLE_ADMIN: "/admin/dashboard",
  };
  return routes[role] || "/login";
}

export default function ActivitesPage() {
  const [activites, setActivites] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [openAnalyseId, setOpenAnalyseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mesActiviteIdsPostulees, setMesActiviteIdsPostulees] = useState(new Set());
  const [postulationEnCours, setPostulationEnCours] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [employesRetires, setEmployesRetires] = useState({}); // { activiteId: Set(employeId) }
  const [confirmationEnCours, setConfirmationEnCours] = useState(null);

  useEffect(() => {
    getAllActivites()
      .then((response) => {
        const data = response.data ?? response;
        const liste = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : null;

        if (liste === null) {
          console.error("Réponse inattendue de /activites :", data);
          setError("Format de réponse inattendu du serveur.");
          setActivites([]);
        } else {
          setActivites(liste);
        }
      })
      .catch((err) => {
        console.error("Erreur chargement activités :", err);
        setError(
          err.response?.status === 403
            ? "Accès refusé (403) — vérifie le token/rôle."
            : "Impossible de charger les activités."
        );
        setActivites([]);
      })
      .finally(() => setLoading(false));

    if (role === "ROLE_EMPLOYEE") {
      getMesCandidatures()
        .then((res) => {
          const ids = new Set((res.data ?? []).map((c) => c.activiteId));
          setMesActiviteIdsPostulees(ids);
        })
        .catch((err) => console.error("Erreur chargement candidatures :", err));
    }
  }, [role]);

  const handlePostuler = async (activiteId) => {
    setPostulationEnCours(activiteId);
    try {
      await postuler(activiteId);
      setMesActiviteIdsPostulees((prev) => new Set(prev).add(activiteId));
    } catch (err) {
      console.error("Erreur candidature :", err);
      alert(err.response?.data?.message || "Impossible de postuler à cette activité.");
    } finally {
      setPostulationEnCours(null);
    }
  };

  const filtered = Array.isArray(activites)
    ? selectedType
      ? activites.filter((a) => a.type === selectedType)
      : activites
    : [];

    const toggleRetireEmploye = (activiteId, employeId) => {
  setEmployesRetires((prev) => {
    const current = new Set(prev[activiteId] || []);
    if (current.has(employeId)) {
      current.delete(employeId);
    } else {
      current.add(employeId);
    }
    return { ...prev, [activiteId]: current };
  });
};

const handleConfirmerAffectation = async (activite) => {
  const retires = employesRetires[activite.id] || new Set();
  const idsFinal = (activite.analyseIA?.employees || [])
    .map((e) => e.id)
    .filter((id) => !retires.has(id));

  if (idsFinal.length === 0) {
    alert("Vous devez garder au moins un employé avant de confirmer.");
    return;
  }

  setConfirmationEnCours(activite.id);
  try {
    const res = await confirmerAffectation(activite.id, idsFinal);
    setActivites((prev) =>
      prev.map((a) => (a.id === activite.id ? res.data : a))
    );
  } catch (err) {
    alert(err.response?.data?.message || "Erreur lors de la confirmation.");
  } finally {
    setConfirmationEnCours(null);
  }
};

  return (
    <div className="activites-page">
      <button
        type="button"
        className="back-btn"
        onClick={() => navigate(getDashboardPath())}
      >
        ← Retour au dashboard
      </button>

      <div className="activites-header">
        <h1 className="page-title">Activités</h1>
        {role === "ROLE_RH" && (
          <button
            className="btn-creer-activite"
            onClick={() => navigate("/activites/creer")}
          >
            + Créer une activité
          </button>
        )}
      </div>

      <div className="activites-types-grid">
        {TYPES.map((t) => (
          <div
            key={t.key}
            className={`type-card ${selectedType === t.key ? "active" : ""}`}
            onClick={() =>
              setSelectedType(selectedType === t.key ? null : t.key)
            }
          >
            <t.Icon className="type-icon" size={26} />
            <span className="type-label">{t.label}</span>
          </div>
        ))}
      </div>

      {loading && <p className="empty-state">Chargement...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && (
        <div className="activites-list">
          {filtered.length === 0 && (
            <p className="empty-state">Aucune activité pour le moment.</p>
          )}
          {filtered.map((a) => {
            const dejaPostule = mesActiviteIdsPostulees.has(a.id);
            return (
              <div key={a.id} className="activite-card">
                <div className="activite-card-header">
                  <span className={`badge badge-${a.type?.toLowerCase()}`}>
                    {a.type}
                  </span>
                  <h3>{a.titre}</h3>
                </div>
                <p>{a.description}</p>
                <div className="activite-meta">
                  <span><IconMapPin size={14} className="meta-icon" /> {a.lieu}</span>
                  <span><IconCalendar size={14} className="meta-icon" /> {a.dateDebut} → {a.dateFin}</span>
              {a.departmentsCibles?.length > 0 && (
                  <span><IconTarget size={14} className="meta-icon" /> {a.departmentsCibles.join(", ")}</span>
                )}
                </div>

                {a.conditions && (
                  <div className="activite-conditions">
                    <strong>Conditions :</strong> {a.conditions}
                  </div>
                )}

                {role === "ROLE_EMPLOYEE" && (
                  <button
                    className={`btn-postuler ${dejaPostule ? "postule" : ""}`}
                    disabled={dejaPostule || postulationEnCours === a.id}
                    onClick={() => handlePostuler(a.id)}
                  >
                    {dejaPostule
                      ? "✓ Déjà postulé"
                      : postulationEnCours === a.id
                      ? "Envoi..."
                      : "Postuler"}
                  </button>
                )}

                {a.analyseIA && role === "ROLE_RH" && (
  <div className="analyse-ia-block">
    <button
      className="btn-voir-analyse"
      onClick={() =>
        setOpenAnalyseId(openAnalyseId === a.id ? null : a.id)
      }
    >
      {openAnalyseId === a.id
        ? "Masquer les recommandations"
        : `Voir les recommandations IA (${a.analyseIA.employees?.length ?? 0})`}
    </button>

    {openAnalyseId === a.id && (
      <div className="analyse-ia-content">
        {a.analyseIA.recommendationSummary && (
          <p className="analyse-summary">{a.analyseIA.recommendationSummary}</p>
        )}
        {a.analyseIA.skillAnalysis && (
          <p className="analyse-detail">{a.analyseIA.skillAnalysis}</p>
        )}

        {a.affectationConfirmee ? (
          <div className="affectation-confirmee-tag">
            <IconCheck size={14} /> Affectation confirmée — {a.employesAffectesIds?.length ?? 0} employé(s) notifié(s)
          </div>
        ) : (
          <>
            <div className="employes-recommandes-list">
              {a.analyseIA.employees?.map((emp) => {
                const retires = employesRetires[a.id] || new Set();
                const estRetire = retires.has(emp.id);
                return (
                  <div
                    key={emp.id}
                    className={`employe-recommande-card ${estRetire ? "retire" : ""}`}
                  >
                    <div className="employe-recommande-header">
                      <strong>{emp.name}</strong>
                      <div className="employe-recommande-header-right">
                        <span className="employe-score">{emp.score?.toFixed(1)} pts</span>
                        <button
                          type="button"
                          className="btn-retirer-employe"
                          onClick={() => toggleRetireEmploye(a.id, emp.id)}
                          title={estRetire ? "Réintégrer" : "Retirer"}
                        >
                          <IconX size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="employe-job">{emp.jobTitle}</div>
                    <div className="employe-skills">
                      <strong>Compétences :</strong> {emp.currentSkills}
                    </div>
                    {emp.missingSkills?.length > 0 && (
                      <div className="employe-missing">
                        <strong>À acquérir :</strong> {emp.missingSkills.join(", ")}
                      </div>
                    )}
                    {estRetire && <div className="employe-retire-label">Retiré de la sélection</div>}
                  </div>
                );
              })}
            </div>

            <button
              className="btn-confirmer-affectation"
              disabled={confirmationEnCours === a.id}
              onClick={() => handleConfirmerAffectation(a)}
            >
              {confirmationEnCours === a.id ? "Confirmation..." : "Confirmer l'affectation et notifier"}
            </button>
          </>
        )}
      </div>
    )}
  </div>
)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}