import api from "./api";

export const postuler = (activiteId) => {
    return api.post(`/candidatures/postuler/${activiteId}`);
};

export const getMesCandidatures = () => {
    return api.get("/candidatures/my");
};

export const getCandidaturesParActivite = (activiteId) => {
    return api.get(`/candidatures/activite/${activiteId}`);
};

export const changerStatutCandidature = (id, statut) => {
    return api.put(`/candidatures/${id}/statut`, null, { params: { statut } });
};