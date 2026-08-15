import api from "./api";

export const getRapportEmploye = (id, debut, fin) =>
    api.get(`/absences/employe/${id}`, { params: { debut, fin } });

export const getRapportTous = (debut, fin) =>
    api.get("/absences/tous", { params: { debut, fin } });