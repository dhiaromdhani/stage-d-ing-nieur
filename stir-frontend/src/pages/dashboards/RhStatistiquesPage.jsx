import { useEffect, useState } from "react";
import { getStatistiquesGlobales } from "../../services/statistiquesService";
import { IconUsers, IconList, IconFileText, IconAlertTriangle, IconCheck, IconX } from "../../components/Icons/Icons";
import "./RhStatistiquesPage.css";

export default function RhStatistiquesPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getStatistiquesGlobales()
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error("Erreur chargement statistiques :", err);
        setError("Impossible de charger les statistiques.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rh-stats-page">
      <h1 className="page-title">Statistiques employés</h1>

      {loading && <p>Chargement...</p>}
      {error && <p className="error-msg">{error}</p>}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-badge neutral"><IconUsers size={22} /></div>
            <span className="stat-value">{stats.totalEmployes}</span>
            <span className="stat-label">Employés</span>
          </div>
          <div className="stat-card">
            <div className="stat-icon-badge neutral"><IconList size={22} /></div>
            <span className="stat-value">{stats.totalActivites}</span>
            <span className="stat-label">Activités créées</span>
          </div>
          <div className="stat-card">
            <div className="stat-icon-badge neutral"><IconFileText size={22} /></div>
            <span className="stat-value">{stats.totalCandidatures}</span>
            <span className="stat-label">Candidatures totales</span>
          </div>
          <div className="stat-card en-attente">
            <div className="stat-icon-badge warning"><IconAlertTriangle size={20} /></div>
            <span className="stat-value">{stats.candidaturesEnAttente}</span>
            <span className="stat-label">En attente</span>
          </div>
          <div className="stat-card acceptee">
            <div className="stat-icon-badge success"><IconCheck size={20} /></div>
            <span className="stat-value">{stats.candidaturesAcceptees}</span>
            <span className="stat-label">Acceptées</span>
          </div>
          <div className="stat-card refusee">
            <div className="stat-icon-badge danger"><IconX size={20} /></div>
            <span className="stat-value">{stats.candidaturesRefusees}</span>
            <span className="stat-label">Refusées</span>
          </div>
        </div>
      )}
    </div>
  );
}