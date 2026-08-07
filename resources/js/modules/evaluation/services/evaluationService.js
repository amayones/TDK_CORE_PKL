import api from '../../../services/api';

export async function fetchEvaluationList(params = {}) {
    const response = await api.get('/evaluation', { params });
    return response.data.data;
}

export async function fetchOptions() {
    const response = await api.get('/evaluation/options');
    return response.data.data;
}

export async function createEvaluation(payload) {
    const response = await api.post('/evaluation', payload);
    return response.data.data;
}

export async function updateEvaluation(id, payload) {
    const response = await api.put(`/evaluation/${id}`, payload);
    return response.data.data;
}

export async function deleteEvaluation(id) {
    const response = await api.delete(`/evaluation/${id}`);
    return response.data;
}