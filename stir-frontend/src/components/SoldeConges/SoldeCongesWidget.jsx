import { useEffect, useState } from "react";
import { getSolde } from "../../services/soldeService";
import { IconAlertTriangle } from "../Icons/Icons";
import "./SoldeCongesWidget.css";

/**
 * Affiche le solde de congés de l'employé connecté sous forme d'anneau
 * de progression + texte. À placer dans EmployeeDashboard et/ou en haut
 * de NewLeave.jsx pour que l'employé voie son solde avant de soumettre.
 *
 * Props:
 *  - userId (string, requis)
 */
export default function SoldeCongesWidget({ userId }) {
  const [solde, setSolde] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    getSolde(userId)
      .then(setSolde)
      .catch(() => setError("Impossible de charger votre solde de congés."))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <div className="solde-widget solde-widget--loading">Chargement du solde…</div>;
  }
  if (error) {
    return <div className="solde-widget solde-widget--error">{error}</div>;
  }

  const { totalJours, joursUtilises, joursRestants } = solde;
  const pourcentage = Math.max(0, Math.min(100, (joursRestants / totalJours) * 100));

  let statut = "ok";
  if (pourcentage <= 15) statut = "critique";
  else if (pourcentage <= 40) statut = "attention";

  return (
    <div className={`solde-widget solde-widget--${statut}`}>
      <div
        className="solde-widget__ring"
        style={{ "--pct": `${pourcentage}%` }}
      >
        <div className="solde-widget__ring-inner">
          <span className="solde-widget__value">{joursRestants}</span>
          <span className="solde-widget__label">jour{joursRestants > 1 ? "s" : ""}</span>
        </div>
      </div>
      <div className="solde-widget__details">
        <p className="solde-widget__title">Solde de congés {new Date().getFullYear()}</p>
        <p className="solde-widget__breakdown">
          {joursUtilises} utilisé{joursUtilises > 1 ? "s" : ""} / {totalJours} au total
        </p>
        {statut === "critique" && (
          <p className="solde-widget__warning">
            <IconAlertTriangle size={13} /> Solde presque épuisé
          </p>
        )}
      </div>
    </div>
  );
}