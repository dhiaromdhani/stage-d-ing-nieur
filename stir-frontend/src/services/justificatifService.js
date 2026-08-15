import api from "./api";

export const soumettreJustificatif = (dateDebut, dateFin, motif) =>
    api.post("/justificatifs", { dateDebut, dateFin, motif });

export const getMesJustificatifs = () => api.get("/justificatifs/my");

export const getJustificatifsEnAttente = () => api.get("/justificatifs/en-attente");

export const changerStatutJustificatif = (id, statut, commentaire) =>
    api.put(`/justificatifs/${id}/statut`, null, { params: { statut, commentaire } });