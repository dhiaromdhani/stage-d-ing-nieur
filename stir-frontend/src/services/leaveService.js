import api from "./api";

// Créer une demande
export const createLeave = (leave) => {
    return api.post("/leaves/create", leave);
};

// Mes demandes
export const getEmployeeLeaves = () => {
    return api.get("/leaves/my");
};

// Demandes par statut
export const getLeavesByStatus = (status) => {
    return api.get(`/leaves/status/${status}`);
};

// Validation
export const validateLeave = (id, comment = "") => {
    return api.put(`/leaves/${id}/approve`, {
        comment
    });
};

// Refus
export const refuseLeave = (id, comment) => {
    return api.put(`/leaves/${id}/refuse`, {
        comment
    });
};