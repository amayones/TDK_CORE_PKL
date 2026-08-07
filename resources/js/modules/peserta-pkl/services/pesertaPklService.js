import api from '../../../services/api';

export async function fetchPesertaPklList(params = {}) {
    const response = await api.get('/peserta-pkl', { params });
    return response.data.data;
}

export async function fetchUserOptions() {
    const response = await api.get('/peserta-pkl/user-options');
    return response.data.data;
}

export async function createPesertaPkl(payload) {
    const response = await api.post('/peserta-pkl', payload);
    return response.data.data;
}

export async function updatePesertaPkl(id, payload) {
    const response = await api.put(`/peserta-pkl/${id}`, payload);
    return response.data.data;
}

export async function deletePesertaPkl(id) {
    const response = await api.delete(`/peserta-pkl/${id}`);
    return response.data;
}