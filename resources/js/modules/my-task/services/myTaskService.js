import api from '../../../services/api';

export async function fetchMyTaskList(params = {}) {
    const response = await api.get('/my-task', { params });
    return response.data.data;
}

export async function createMyTask(payload) {
    const response = await api.post('/my-task', payload);
    return response.data.data;
}

export async function updateMyTask(id, payload) {
    const response = await api.put(`/my-task/${id}`, payload);
    return response.data.data;
}

export async function deleteMyTask(id) {
    const response = await api.delete(`/my-task/${id}`);
    return response.data;
}

export async function completeMyTask(id) {
    const response = await api.post(`/my-task/${id}/complete`);
    return response.data.data;
}
