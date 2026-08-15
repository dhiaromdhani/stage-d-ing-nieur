import api from "./api";

// Liste de toutes les activités
export const getAllActivites = () => {
    return api.get("/activites");
};

// Activités filtrées par type
export const getActivitesByType = (type) => {
    return api.get(`/activites/type/${type}`);
};

// Détail d'une activité
export const getActiviteById = (id) => {
    return api.get(`/activites/${id}`);
};

// Créer une activité (RH uniquement)
export const createActivite = (activite) => {
    return api.post("/activites", activite);
};

// Modifier une activité (RH uniquement)
export const updateActivite = (id, activite) => {
    return api.put(`/activites/${id}`, activite);
};

// Supprimer une activité (RH uniquement)
export const deleteActivite = (id) => {
    return api.delete(`/activites/${id}`);
};

export const confirmerAffectation = (activiteId, employeIds) => {
    return api.put(`/activites/${activiteId}/confirmer-affectation`, employeIds);
};

export const repondreAffectation = (id, statut) => {
    return api.put(`/activites/affectations/${id}/reponse`, null, { params: { statut } });
};

export const getMesAffectations = () => {
    return api.get("/activites/affectations/my");
};
