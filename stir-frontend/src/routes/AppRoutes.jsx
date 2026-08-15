import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import EmployeeDashboard from "../pages/dashboards/EmployeeDashboard";
import EmployeeHome from "../pages/dashboards/EmployeeHome";
import ChefDashboard from "../pages/dashboards/ChefDashboard";
import SousDirecteurDashboard from "../pages/dashboards/SousDirecteurDashboard";
import DirecteurDashboard from "../pages/dashboards/DirecteurDashboard";
import RhDashboard from "../pages/dashboards/RhDashboard";
import AdminDashboard from "../pages/dashboards/AdminDashboard";
import NewLeave from "../pages/leave/NewLeave";
import MyLeaves from "../pages/leave/MyLeaves";
import ActivitesPage from "../pages/activites/ActivitesPage";
import CreerActivitePage from "../pages/activites/CreerActivitePage";
import RhStatistiquesPage from "../pages/dashboards/RhStatistiquesPage"; // ajuste le chemin
import ConvertirCongePage from "../pages/leave/ConvertirCongePage";
import GestionSalairesPage from "../pages/dashboards/GestionSalairesPage";
import GestionProfilsPage from "../pages/dashboards/GestionProfilsPage";
import PointagePage from "../pages/pointage/PointagePage";
import AbsencesRhPage from "../pages/dashboards/AbsencesRhPage";
import RhValidationCongesPage from "../pages/dashboards/RhValidationCongesPage";
import ChefOverviewPage from "../pages/dashboards/ChefOverviewPage";
import SousDirecteurOverviewPage from "../pages/dashboards/SousDirecteurOverviewPage";
import DirecteurOverviewPage from "../pages/dashboards/DirecteurOverviewPage";
import RemplacementsPage from "../pages/Chef/RemplacementsPage";
import PlanningPrevisionnelPage from "../pages/Planning/PlanningPrevisionnelPage";





function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      {/* Accueil employé = uniquement les 2 actions */}
      <Route path="/employee" element={<EmployeeHome />} />
      <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
<Route path="/chef/dashboard" element={<ChefOverviewPage />} />
      <Route path="/sous-directeur/dashboard" element={<SousDirecteurOverviewPage />} />
      <Route path="/directeur/dashboard" element={<DirecteurOverviewPage />} />
      <Route path="/rh/dashboard" element={<RhDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/leave/new" element={<NewLeave />} />
      <Route path="/leave/my" element={<MyLeaves />} />
      <Route path="/leave/statistics" element={<EmployeeDashboard />} />
      <Route path="/activites" element={<ActivitesPage />} />
      <Route path="/activites/creer" element={<CreerActivitePage />} />
      <Route path="/activites/:id/modifier" element={<CreerActivitePage />} />
      <Route path="/rh/statistiques" element={<RhStatistiquesPage />} />
      <Route path="/leave/convertir" element={<ConvertirCongePage />} />
      <Route path="/rh/salaires" element={<GestionSalairesPage />} />
      <Route path="/admin/profils" element={<GestionProfilsPage />} />
      <Route path="/pointage" element={<PointagePage />} />
      <Route path="/rh/absences" element={<AbsencesRhPage />} />
      <Route path="/rh/validation-conges" element={<RhValidationCongesPage />} />
      <Route path="/chef/validation-conges" element={<ChefDashboard />} />
      <Route path="/sous-directeur/validation-conges" element={<SousDirecteurDashboard />} />
      <Route path="/directeur/validation-conges" element={<DirecteurDashboard />} /> 
      <Route path="/chef/remplacements" element={<RemplacementsPage />}/>
      <Route path="/planning-previsionnel"element={<PlanningPrevisionnelPage />}/> 

    </Routes>
  );
}

export default AppRoutes;
