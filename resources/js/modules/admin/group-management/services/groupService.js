import api from '../../../../services/api';

export async function fetchGroupsList(params = {}) {
    const response = await api.get('/admin/groups', { params });
    return response.data.data;
}

export async function fetchGroupDetail(id) {
    const response = await api.get(`/admin/groups/${id}`);
    return response.data.data;
}

export async function createGroup(payload) {
    const response = await api.post('/admin/groups', payload);
    return response.data.data;
}

export async function updateGroup(id, payload) {
    const response = await api.put(`/admin/groups/${id}`, payload);
    return response.data.data;
}

export async function deleteGroup(id) {
    const response = await api.delete(`/admin/groups/${id}`);
    return response.data;
}