import api from "./api";

export const getAllUsers = () => {
    return api.get("/users");
};

export const setSalaireEmploye = (userId, salaireMensuel) => {
    return api.put(`/users/${userId}/salaire`, { salaireMensuel });
};

export const setProfilEmploye = (userId, profil) => {
    return api.put(`/users/${userId}/profil`, profil);
};