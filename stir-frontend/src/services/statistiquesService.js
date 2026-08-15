import api from "./api";

export const getStatistiquesGlobales = () => {
    return api.get("/statistiques");
};