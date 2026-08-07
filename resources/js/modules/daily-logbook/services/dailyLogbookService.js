import api from '../../../services/api';

export async function fetchDailyLogbookList(params = {}) {
    const response = await api.get('/daily-logbook', { params });
    return response.data.data;
}

export async function createDailyLogbook(payload) {
    const response = await api.post('/daily-logbook', payload);
    return response.data.data;
}

export async function updateDailyLogbook(id, payload) {
    const response = await api.put(`/daily-logbook/${id}`, payload);
    return response.data.data;
}

export async function deleteDailyLogbook(id) {
    const response = await api.delete(`/daily-logbook/${id}`);
    return response.data;
}

export async function submitDailyLogbook(id) {
    const response = await api.post(`/daily-logbook/${id}/submit`);
    return response.data.data;
}
