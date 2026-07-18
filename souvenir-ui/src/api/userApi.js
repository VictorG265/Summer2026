import api from './axios';

const userApi = {
    getAll: () => api.get('users'),
    getById: (id) => api.get(`users/${id}`),
    getMe: () => api.get('users/me'),
    update: (id, data) => api.put(`users/${id}`, data),
    delete: (id) => api.delete(`users/${id}`),
};

export default userApi;