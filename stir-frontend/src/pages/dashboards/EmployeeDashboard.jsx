import "./EmployeeDashboard.css";

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getDashboardStats, getMySolde } from "../../services/soldeService";
import { getEmployeeLeaves } from "../../services/leaveService";
import { IconCalendar, IconCalendarPlus, IconCheckCircle } from "../../components/Icons/Icons";

const BACK_PATH_BY_ROLE = {
  ROLE_EMPLOYEE: "/employee",
  ROLE_CHEF: "/chef/dashboard",
  ROLE_SOUS_DIRECTEUR: "/sous-directeur/dashboard",
  ROLE_DIRECTEUR: "/directeur/dashboard",
  ROLE_RH: "/rh/dashboard",
  ROLE_ADMIN: "/admin/dashboard",
};

function countApprovedLeaveDays(leaves) {
  return leaves
    .filter((leave) => leave.status === "APPROVED" && leave.startDate && leave.endDate)
    .reduce((total, leave) => {
      const start = new Date(`${leave.startDate}T00:00:00`);
      const end = new Date(`${leave.endDate}T00:00:00`);
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const duration = Math.floor((end - start) / millisecondsPerDay) + 1;

      return total + Math.max(duration, 0);
    }, 0);
}

function EmployeeDashboard() {
  const [stats, setStats] = useState(null);
  const [solde, setSolde] = useState(null);
  const [approvedLeaveDays, setApprovedLeaveDays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    Promise.all([getDashboardStats(), getMySolde(), getEmployeeLeaves()])
      .then(([statsData, soldeData, leavesResponse]) => {
        setStats(statsData);
        setSolde(soldeData);
        setApprovedLeaveDays(countApprovedLeaveDays(leavesResponse.data ?? []));
      })
      .catch(() => {
        setError("Impossible de charger votre solde de congés.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const total = solde?.totalJours ?? stats?.totalLeaves ?? 0;
  const apiUsed = solde?.joursUtilises ?? stats?.usedLeaves ?? 0;
  const used = Math.max(apiUsed, approvedLeaveDays);
  const remaining = Math.max(total - used, 0);
  const percentUsed = total > 0 ? Math.round((used / total) * 100) : 0;
  const percentRemaining = total > 0 ? Math.round((remaining / total) * 100) : 0;
  const backPath = BACK_PATH_BY_ROLE[localStorage.getItem("role")] || "/login";

  return (
    <div className="employee-dashboard">
      <div className="employee-header">
        {/* Bouton retour */}
        <Link to={backPath} className="back-btn">
          ← Retour
        </Link>

        <span className="eyebrow">Espace congés</span>
        <h1 className="employee-title page-title">Solde de congés</h1>
        <p className="employee-subtitle">
          Consultez votre solde annuel et le détail de vos jours restants.
        </p>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Chargement de votre solde...</p>
        </div>
      ) : (
        <section className="leave-dashboard">
          <div className="leave-hero">
            <div className="leave-hero-left">
              <span className="leave-badge">Solde de congés</span>
              <h2 className="leave-remaining-number">
                {remaining}
                <span className="leave-unit">jours</span>
              </h2>
              <p className="leave-remaining-label">disponibles</p>

              <div className="progress-block">
                <div className="progress-header">
                  <span>Consommation annuelle</span>
                  <strong>{percentUsed}%</strong>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min(percentUsed, 100)}%` }}
                  />
                </div>
                <div className="progress-legend">
                  <span>{used} utilisés</span>
                  <span>{total} jours au total</span>
                </div>
              </div>
            </div>

            <div className="leave-hero-right">
              <div className="ring-chart">
                <svg viewBox="0 0 120 120" className="ring-svg">
                  <circle
                    className="ring-bg"
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    strokeWidth="10"
                  />
                  <circle
                    className="ring-value"
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    strokeWidth="10"
                    strokeDasharray={`${percentRemaining * 3.27} 327`}
                    strokeDashoffset="0"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="ring-center">
                  <span className="ring-percent">{percentRemaining}%</span>
                  <span className="ring-label">restants</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">
                <IconCalendar size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total annuel</span>
                <span className="stat-value">{total}</span>
                <span className="stat-unit">jours alloués</span>
              </div>
            </div>

            <div className="stat-card used">
              <div className="stat-icon">
                <IconCalendarPlus size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Congés utilisés</span>
                <span className="stat-value">{used}</span>
                <span className="stat-unit">{percentUsed}% du solde</span>
              </div>
            </div>

            <div className="stat-card remaining">
              <div className="stat-icon">
                <IconCheckCircle size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Congés restants</span>
                <span className="stat-value">{remaining}</span>
                <span className="stat-unit">{percentRemaining}% disponibles</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default EmployeeDashboard;