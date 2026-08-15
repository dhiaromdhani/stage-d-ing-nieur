import api from "./api";


// Récupérer les remplacements de l'équipe
export const getRemplacements = async () => {

    const response = await api.get(
        "/remplacements"
    );

    return response.data;
};


// Créer
export const createRemplacement = async (
    remplacement
) => {

    const response = await api.post(
        "/remplacements",
        remplacement
    );

    return response.data;
};


// Modifier
export const updateRemplacement = async (
    id,
    remplacement
) => {

    const response = await api.put(
        `/remplacements/${id}`,
        remplacement
    );

    return response.data;
};


// Supprimer
export const deleteRemplacement = async (
    id
) => {

    const response = await api.delete(
        `/remplacements/${id}`
    );

    return response.data;
};