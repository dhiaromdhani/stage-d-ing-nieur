import api from "./api";

export const getMyNotifications = () => {
    return api.get("/notifications/my");
};

export const getUnreadCount = () => {
    return api.get("/notifications/my/unread-count");
};

export const markAsRead = (id) => {
    return api.put(`/notifications/${id}/lue`);
};