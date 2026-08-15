import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLeavesByStatus } from "../../services/leaveService";
import {
  IconCheckCircle, IconCalendarPlus, IconFileText,
  IconList, IconClock, IconCoins, IconArrowRight,
} from "../../components/Icons/Icons";
import "./RoleOverviewPage.css";

export default function RoleOverviewPage({ status, roleLabel, validationPath }) {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeavesByStatus(status)
      .then((res) => setPendingCount(Array.isArray(res.data) ? res.data.length : 0))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status]);

  const QUICK_ACTIONS = [
    { label: "Validation congé", to: validationPath, Icon: IconCheckCircle, badge: pendingCount },
    { label: "Poser un congé", to: "/leave/new", Icon: IconCalendarPlus },
    { label: "Mes demandes", to: "/leave/my", Icon: IconFileText },
    { label: "Convertir en argent", to: "/leave/convertir", Icon: IconCoins },
    { label: "Activités", to: "/activites", Icon: IconList },
    { label: "Pointage", to: "/pointage", Icon: IconClock },
  ];

  return (
    <div className="role-overview">
      <div className="role-overview-hero">
        <span className="role-overview-eyebrow">Espace {roleLabel} — STIR</span>
        <h1 className="role-overview-title">Tableau de bord</h1>
        <p className="role-overview-subtitle">
          Vue d'ensemble de vos demandes de congé et actions disponibles.
        </p>
      </div>

      {loading ? (
        <p className="role-overview-loading">Chargement...</p>
      ) : (
        <>
          <div className="role-overview-highlight">
            <div className="role-highlight-icon"><IconCheckCircle size={26} /></div>
            <div>
              <span className="role-highlight-value">{pendingCount}</span>
              <span className="role-highlight-label">demande{pendingCount > 1 ? "s" : ""} de congé en attente de votre validation</span>
            </div>
            <Link to={validationPath} className="role-highlight-cta">
              Traiter <IconArrowRight size={15} />
            </Link>
          </div>

          <h2 className="role-overview-section-title">Actions rapides</h2>
          <div className="role-overview-actions">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.to} to={action.to} className="role-action-tile">
                <div className="role-action-icon">
                  <action.Icon size={22} />
                  {action.badge > 0 && <span className="role-action-badge">{action.badge}</span>}
                </div>
                <span className="role-action-label">{action.label}</span>
                <IconArrowRight size={15} className="role-action-arrow" />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}