import api from "./api";

export const getAllUsers = async () => {
    const response = await api.get("/users");
    return response.data;
};

export const getUsersByRole = async (role) => {
    const users = await getAllUsers();
    return users.filter((u) => u.role === role);
};

export const createUser = async (user) => {
    const response = await api.post("/users", user);
    return response.data;
};

export const updateUserRole = async (id, role) => {
    const response = await api.put(`/users/${id}`, { role });
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};