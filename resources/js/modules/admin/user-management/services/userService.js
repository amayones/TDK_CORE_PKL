import api from '../../../../services/api';

export async function fetchUsers(params = {}) {
    const response = await api.get('/admin/users', { params });
    return response.data.data;
}

export async function fetchUserDetail(id) {
    const response = await api.get(`/admin/users/${id}`);
    return response.data.data;
}

export async function fetchGroups() {
    const response = await api.get('/admin/users/groups');
    return response.data.data;
}

export async function createUser(payload) {
    const response = await api.post('/admin/users', payload);
    return response.data.data;
}

export async function updateUser(id, payload) {
    const response = await api.put(`/admin/users/${id}`, payload);
    return response.data.data;
}

export async function deleteUser(id) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
}