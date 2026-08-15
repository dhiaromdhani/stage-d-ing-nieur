import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStatistiquesGlobales } from "../../services/statistiquesService";
import { getLeavesByStatus } from "../../services/leaveService";
import {
  IconUsers, IconList, IconFileText, IconCheckCircle,
  IconPlusCircle, IconBarChart, IconCoins, IconClock, IconArrowRight,
} from "../../components/Icons/Icons";
import "./RhDashboard.css";

export default function RhDashboard() {
  const [stats, setStats] = useState(null);
  const [congesEnAttente, setCongesEnAttente] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getStatistiquesGlobales(),
      getLeavesByStatus("PENDING_RH"),
    ])
      .then(([statsRes, leavesRes]) => {
        setStats(statsRes.data);
        setCongesEnAttente(Array.isArray(leavesRes.data) ? leavesRes.data.length : 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const QUICK_ACTIONS = [
    { label: "Validation congé", to: "/rh/validation-conges", Icon: IconCheckCircle, badge: congesEnAttente },
    { label: "Créer une activité", to: "/activites/creer", Icon: IconPlusCircle },
    { label: "Statistiques employés", to: "/rh/statistiques", Icon: IconBarChart },
    { label: "Gestion des salaires", to: "/rh/salaires", Icon: IconCoins },
    { label: "Suivi des absences", to: "/rh/absences", Icon: IconClock },
    { label: "Profils employés", to: "/admin/profils", Icon: IconUsers },
  ];

  return (
    <div className="rh-overview">
      <div className="rh-overview-hero">
        <span className="rh-overview-eyebrow">Espace RH — STIR</span>
        <h1 className="rh-overview-title">Tableau de bord Ressources Humaines</h1>
        <p className="rh-overview-subtitle">
          Vue d'ensemble de l'activité RH : effectifs, congés, activités et candidatures.
        </p>
      </div>

      {loading ? (
        <p className="rh-overview-loading">Chargement des statistiques...</p>
      ) : (
        <>
          <div className="rh-overview-stats">
            <div className="rh-stat-card">
              <div className="rh-stat-icon neutral"><IconUsers size={22} /></div>
              <span className="rh-stat-value">{stats?.totalEmployes ?? 0}</span>
              <span className="rh-stat-label">Employés</span>
            </div>
            <div className="rh-stat-card">
              <div className="rh-stat-icon neutral"><IconList size={22} /></div>
              <span className="rh-stat-value">{stats?.totalActivites ?? 0}</span>
              <span className="rh-stat-label">Activités créées</span>
            </div>
            <div className="rh-stat-card">
              <div className="rh-stat-icon neutral"><IconFileText size={22} /></div>
              <span className="rh-stat-value">{stats?.totalCandidatures ?? 0}</span>
              <span className="rh-stat-label">Candidatures</span>
            </div>
            <div className="rh-stat-card warning">
              <div className="rh-stat-icon warning"><IconCheckCircle size={22} /></div>
              <span className="rh-stat-value">{congesEnAttente}</span>
              <span className="rh-stat-label">Congés en attente</span>
            </div>
            <div className="rh-stat-card success">
              <div className="rh-stat-icon success"><IconCheckCircle size={22} /></div>
              <span className="rh-stat-value">{stats?.candidaturesAcceptees ?? 0}</span>
              <span className="rh-stat-label">Candidatures acceptées</span>
            </div>
            <div className="rh-stat-card danger">
              <div className="rh-stat-icon danger"><IconCheckCircle size={22} /></div>
              <span className="rh-stat-value">{stats?.candidaturesRefusees ?? 0}</span>
              <span className="rh-stat-label">Candidatures refusées</span>
            </div>
          </div>

          <h2 className="rh-overview-section-title">Actions rapides</h2>
          <div className="rh-overview-actions">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.to} to={action.to} className="rh-action-tile">
                <div className="rh-action-icon">
                  <action.Icon size={24} />
                  {action.badge > 0 && <span className="rh-action-badge">{action.badge}</span>}
                </div>
                <span className="rh-action-label">{action.label}</span>
                <IconArrowRight size={16} className="rh-action-arrow" />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}