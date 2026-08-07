import api from '../../../services/api';

export async function fetchTaskAssignmentList(params = {}) {
    const response = await api.get('/task-assignment', { params });
    return response.data.data;
}

export async function fetchOptions() {
    const response = await api.get('/task-assignment/options');
    return response.data.data;
}

export async function createTaskAssignment(payload) {
    const response = await api.post('/task-assignment', payload);
    return response.data.data;
}

export async function updateTaskAssignment(id, payload) {
    const response = await api.put(`/task-assignment/${id}`, payload);
    return response.data.data;
}

export async function deleteTaskAssignment(id) {
    const response = await api.delete(`/task-assignment/${id}`);
    return response.data;
}