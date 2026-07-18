import api from './axios';

const orderApi = {
    getAll: () => api.get('orders'),
    getById: (id) => api.get(`orders/${id}`),
    getMyOrders: () => api.get('orders/my'),
    getByStatus: (status) => api.get(`orders/status/${status}`),
    create: (data) => api.post('orders', data),
    updateStatus: (id, status) => api.patch(`orders/${id}/status`, null, {
        params: { status }
    }),
    delete: (id) => api.delete(`orders/${id}`),
};

export default orderApi;