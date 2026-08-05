import api from '../../../services/api';

export async function fetchInventoryList(params = {}) {
    const response = await api.get('/inventory', { params });
    return response.data.data;
}

export async function createInventory(payload) {
    const response = await api.post('/inventory', payload);
    return response.data.data;
}

export async function updateInventory(id, payload) {
    const response = await api.put(`/inventory/${id}`, payload);
    return response.data.data;
}

export async function deleteInventory(id) {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
}