import { useNavigate } from "react-router-dom";
import NotificationBell from "../NotificationBell/NotificationBell";
import "./Topbar.css";

const ROLES = [
    { label: "Employé", role: "ROLE_EMPLOYEE" },
    { label: "Chef de service", role: "ROLE_CHEF" },
    { label: "Sous-directeur", role: "ROLE_SOUS_DIRECTEUR" },
    { label: "Directeur", role: "ROLE_DIRECTEUR" },
    { label: "RH", role: "ROLE_RH" },
    { label: "Admin", role: "ROLE_ADMIN" },
];

export default function Topbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  return (
    <div className="topbar">
      <div className="topbar-right">
        {["ROLE_EMPLOYEE", "ROLE_RH"].includes(role) && <NotificationBell />}

        <div className="stir-roles">
          <span className="employee-btn">Utilisateur</span>
          <div className="stir-roles-menu">
            {ROLES.map((r) => (
              <button
                key={r.role}
                className="stir-roles-item"
                onClick={() => navigate(`/login?role=${r.role}`)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}