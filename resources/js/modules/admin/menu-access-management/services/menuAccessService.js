import api from '../../../../services/api';

export async function fetchAccessGroups() {
    const response = await api.get('/admin/menu-access/groups');
    return response.data.data;
}

export async function fetchAccessMatrix(groupId) {
    const response = await api.get(`/admin/menu-access/${groupId}/matrix`);
    return response.data.data;
}

export async function saveAccessMatrix(groupId, permissions) {
    const response = await api.put(`/admin/menu-access/${groupId}`, { permissions });
    return response.data;
}