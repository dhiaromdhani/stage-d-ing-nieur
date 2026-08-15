import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const getApiErrorMessage = (error, fallback = "Une erreur est survenue.") => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (
    error?.message === "Network Error" ||
    error?.code === "ERR_NETWORK" ||
    error?.code === "ECONNREFUSED"
  ) {
    return "Le backend n’est pas disponible. Démarrez le serveur sur http://localhost:8080 puis réessayez.";
  }

  return fallback;
};



// Ajouter automatiquement JWT

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("jwt");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;