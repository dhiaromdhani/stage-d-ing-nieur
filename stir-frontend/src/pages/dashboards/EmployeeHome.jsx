import "./EmployeeDashboard.css";
import { Link } from "react-router-dom";
import { IconCalendarPlus, IconFileText } from "../../components/Icons/Icons";

function EmployeeHome() {
  return (
    <div className="employee-dashboard">
      <div className="employee-header">
        <span className="eyebrow">Espace collaborateur</span>
        <h1 className="employee-title page-title">Espace Employé STIR</h1>
        <p className="employee-subtitle">
          Gérez vos demandes de congé et suivez leur état de validation.
        </p>
      </div>

      <div className="action-grid">
        <Link to="/leave/new" className="action-card primary">
          <div className="action-icon">
            <IconCalendarPlus size={24} />
          </div>
          <h3>Nouvelle demande de congé</h3>
          <p>
            Soumettez une nouvelle demande en précisant le motif et les dates
            souhaitées.
          </p>
          <span className="action-cta">
            Créer une demande <span className="arrow">→</span>
          </span>
        </Link>

        <Link to="/leave/my" className="action-card secondary">
          <div className="action-icon">
            <IconFileText size={24} />
          </div>
          <h3>Mes demandes</h3>
          <p>
            Consultez l'historique et le statut de toutes vos demandes de
            congé.
          </p>
          <span className="action-cta">
            Voir mes demandes <span className="arrow">→</span>
          </span>
        </Link>
      </div>
    </div>
  );
}

export default EmployeeHome;