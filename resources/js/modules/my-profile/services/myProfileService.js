import api from '../../../services/api';

export async function fetchMyProfileList(params = {}) {
    const response = await api.get('/my-profile', { params });
    return response.data.data;
}

export async function createMyProfile(payload) {
    const response = await api.post('/my-profile', payload);
    return response.data.data;
}

export async function updateMyProfile(id, payload) {
    const response = await api.put(`/my-profile/${id}`, payload);
    return response.data.data;
}

export async function deleteMyProfile(id) {
    const response = await api.delete(`/my-profile/${id}`);
    return response.data;
}

export async function activateMyProfile(id) {
    const response = await api.post(`/my-profile/${id}/activate`);
    return response.data.data;
}
