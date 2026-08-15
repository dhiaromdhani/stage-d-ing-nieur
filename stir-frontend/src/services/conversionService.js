import api from "./api";

export const demanderConversion = (nombreJours) => {
    return api.post("/conversions", { nombreJours });
};

export const getMesConversions = () => {
    return api.get("/conversions/my");
};

export const getConversionsEnAttente = () => {
    return api.get("/conversions/en-attente");
};

export const changerStatutConversion = (id, statut, commentaire) => {
    return api.put(`/conversions/${id}/statut`, null, { params: { statut, commentaire } });
};