import api from '../../../services/api';

export async function fetchTes2List(params = {}) {
    const response = await api.get('/tes2', { params });
    return response.data.data;
}

export async function createTes2(payload) {
    const response = await api.post('/tes2', payload);
    return response.data.data;
}

export async function updateTes2(id, payload) {
    const response = await api.put(`/tes2/${id}`, payload);
    return response.data.data;
}

export async function deleteTes2(id) {
    const response = await api.delete(`/tes2/${id}`);
    return response.data;
}