import api from '../../../services/api';

export async function fetchTesList(params = {}) {
    const response = await api.get('/tes', { params });
    return response.data.data;
}

export async function createTes(payload) {
    const response = await api.post('/tes', payload);
    return response.data.data;
}

export async function updateTes(id, payload) {
    const response = await api.put(`/tes/${id}`, payload);
    return response.data.data;
}

export async function deleteTes(id) {
    const response = await api.delete(`/tes/${id}`);
    return response.data;
}