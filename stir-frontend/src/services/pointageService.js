import api from "./api";

export const pointerEntree = () => api.post("/pointages/entree");
export const pointerSortie = () => api.post("/pointages/sortie");
export const getMesPointages = (debut, fin) =>
    api.get("/pointages/my", { params: { debut, fin } });