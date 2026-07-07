import api from 'axios.js';

const productApi = {

    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    searchByName: (name) => api.get('/products/search', {params: {name}}),
    getByCategory: (category) => api.get(`/products/category/${category}`),
    getByCountry: (country) => api.get(`/products/country/${country}`),
    
    filter: (category, country) => api.get('/products/filter', {params: {category, country}}),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
};

export default productApi;