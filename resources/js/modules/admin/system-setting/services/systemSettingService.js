import api from '../../../../services/api';

export async function fetchSettings() {
    const response = await api.get('/admin/settings');
    return response.data.data;
}

export async function createSetting(payload) {
    const response = await api.post('/admin/settings', payload);
    return response.data.data;
}

export async function updateSetting(id, payload) {
    const response = await api.put(`/admin/settings/${id}`, payload);
    return response.data.data;
}

export async function deleteSetting(id) {
    const response = await api.delete(`/admin/settings/${id}`);
    return response.data;
}