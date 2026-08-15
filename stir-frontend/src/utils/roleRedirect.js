const ROUTES_PAR_ROLE = {
  ROLE_EMPLOYEE: "/employee",
  ROLE_CHEF: "/chef/dashboard",
  ROLE_SOUS_DIRECTEUR: "/sous-directeur/dashboard",
  ROLE_DIRECTEUR: "/directeur/dashboard",
  ROLE_RH: "/rh/dashboard",
  ROLE_ADMIN: "/admin/dashboard",
};

export function getDashboardPath(role) {
  return ROUTES_PAR_ROLE[role] || "/employee";
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}