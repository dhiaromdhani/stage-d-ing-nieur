import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import {
  IconHome, IconList, IconPlusCircle, IconCheckCircle, IconBarChart,
  IconCalendarPlus, IconCalendar, IconFileText, IconPieChart, IconLogOut, IconCoins,
  IconUsers, IconClock,
} from "../Icons/Icons"; 
import "./Sidebar.css";

const MENUS_PAR_ROLE = {
  ROLE_RH: [
    { label: "Accueil", to: "/rh/dashboard", Icon: IconHome },
    { label: "Activités", to: "/activites", Icon: IconList },
    { label: "Créer une activité", to: "/activites/creer", Icon: IconPlusCircle },
    { label: "Validation congé", to: "/rh/validation-conges", Icon: IconCheckCircle },
    { label: "Statistiques employés", to: "/rh/statistiques", Icon: IconBarChart },
    { label: "Gestion des salaires", to: "/rh/salaires", Icon: IconCoins },
    { label: "Suivi absences", to: "/rh/absences", Icon: IconClock },
],
  ROLE_EMPLOYEE: [
    { label: "Accueil", to: "/employee", Icon: IconHome },
    { label: "Nouvelle demande de congé", to: "/leave/new", Icon: IconCalendarPlus },
    { label: "Mes demandes", to: "/leave/my", Icon: IconFileText },
    { label: "Convertir en argent", to: "/leave/convertir", Icon: IconCoins },
    { label: "Activités", to: "/activites", Icon: IconList },
    { label: "Mes statistiques", to: "/leave/statistics", Icon: IconPieChart },
    { label: "Pointage", to: "/pointage", Icon: IconClock },
    {label: "Planning prévisionnel",
    to: "/planning-previsionnel",
    Icon: IconCalendarPlus},
  ],
 ROLE_CHEF: [
    {
        label: "Accueil",
        to: "/chef/dashboard",
        Icon: IconHome
    },
    {
    label: "Remplacements",
    to: "/chef/remplacements",
    Icon: IconUsers
},
{
    label: "Planning prévisionnel",
    to: "/planning-previsionnel",
    Icon: IconCalendar
},

    {
        label: "Validation congé",
        to: "/chef/validation-conges",
        Icon: IconCheckCircle
    },

    {
        label: "Remplacements",
        to: "/chef/remplacements",
        Icon: IconUsers
    },

    {
        label: "Planning prévisionnel",
        to: "/planning-previsionnel",
        Icon: IconCalendarPlus
    },

    {
        label: "Nouvelle demande de congé",
        to: "/leave/new",
        Icon: IconCalendarPlus
    },

    {
        label: "Mes demandes",
        to: "/leave/my",
        Icon: IconFileText
    },

    {
        label: "Convertir en argent",
        to: "/leave/convertir",
        Icon: IconCoins
    },

    {
        label: "Activités",
        to: "/activites",
        Icon: IconList
    },

    {
        label: "Pointage",
        to: "/pointage",
        Icon: IconClock
    },
],
ROLE_SOUS_DIRECTEUR: [
    { label: "Accueil", to: "/sous-directeur/dashboard", Icon: IconHome },
    { label: "Validation congé", to: "/sous-directeur/validation-conges", Icon: IconCheckCircle },
    { label: "Nouvelle demande de congé", to: "/leave/new", Icon: IconCalendarPlus },
    { label: "Mes demandes", to: "/leave/my", Icon: IconFileText },
    { label: "Convertir en argent", to: "/leave/convertir", Icon: IconCoins },
    { label: "Activités", to: "/activites", Icon: IconList },
    { label: "Pointage", to: "/pointage", Icon: IconClock },
],
ROLE_DIRECTEUR: [
    { label: "Accueil", to: "/directeur/dashboard", Icon: IconHome },
    { label: "Validation congé", to: "/directeur/validation-conges", Icon: IconCheckCircle },
    { label: "Nouvelle demande de congé", to: "/leave/new", Icon: IconCalendarPlus },
    { label: "Mes demandes", to: "/leave/my", Icon: IconFileText },
    { label: "Convertir en argent", to: "/leave/convertir", Icon: IconCoins },
    { label: "Activités", to: "/activites", Icon: IconList },
    { label: "Pointage", to: "/pointage", Icon: IconClock },
],
  ROLE_ADMIN: [
    { label: "Accueil", to: "/admin/dashboard", Icon: IconHome },
    { label: "Profils employés", to: "/admin/profils", Icon: IconUsers },
],
};

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const menu = MENUS_PAR_ROLE[role] || [];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="STIR" className="sidebar-logo-img" />
        <span className="sidebar-brand-name">STIR</span>
      </div>

      <nav className="sidebar-nav">
        {menu.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <item.Icon className="sidebar-icon" size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        <IconLogOut size={16} />
        <span>Déconnecter</span>
      </button>
    </aside>
  );
}