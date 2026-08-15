import api from "./api";


// Planning de toute l'équipe
export const getTeamPlanning = async () => {

    const response = await api.get(
        "/planning-previsionnel/equipe"
    );

    return response.data;
};


// Mes prévisions
export const getMyPlanning = async () => {

    const response = await api.get(
        "/planning-previsionnel/mes-previsions"
    );

    return response.data;
};


// Ajouter
export const createPlanning = async (
    planning
) => {

    const response = await api.post(
        "/planning-previsionnel",
        planning
    );

    return response.data;
};


// Modifier
export const updatePlanning = async (
    id,
    planning
) => {

    const response = await api.put(
        `/planning-previsionnel/${id}`,
        planning
    );

    return response.data;
};


// Supprimer
export const deletePlanning = async (
    id
) => {

    const response = await api.delete(
        `/planning-previsionnel/${id}`
    );

    return response.data;
};