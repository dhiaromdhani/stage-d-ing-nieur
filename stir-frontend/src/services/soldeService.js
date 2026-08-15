import api from "./api"; // votre instance Axios existante avec intercepteur JWT

export const getDashboardStats = async () => {
  const response = await api.get("/soldes/me");
  return response.data;
};

export const getMySolde = async () => {
    const response = await api.get("/soldes/me");
    return response.data;
};

export const getSolde = async (userId) => {
  const response = await api.get(`/api/soldes/${userId}`);
  return response.data;
};

export const getSoldeAnnee = async (userId, annee) => {
  const response = await api.get(`/api/soldes/${userId}/${annee}`);
  return response.data;
};
