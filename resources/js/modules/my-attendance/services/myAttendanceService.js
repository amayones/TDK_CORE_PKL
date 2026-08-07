import api from '../../../services/api';

export async function fetchMyAttendanceList(params = {}) {
    const response = await api.get('/my-attendance', { params });
    return response.data.data;
}

export async function createMyAttendance(payload) {
    const response = await api.post('/my-attendance', payload);
    return response.data.data;
}

export async function updateMyAttendance(id, payload) {
    const response = await api.put(`/my-attendance/${id}`, payload);
    return response.data.data;
}

export async function deleteMyAttendance(id) {
    const response = await api.delete(`/my-attendance/${id}`);
    return response.data;
}

export async function approveMyAttendance(id) {
    const response = await api.post(`/my-attendance/${id}/approve`);
    return response.data.data;
}
