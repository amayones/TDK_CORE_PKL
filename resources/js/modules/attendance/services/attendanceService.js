import api from '../../../services/api';

export async function fetchAttendanceList(params = {}) {
    const response = await api.get('/attendance', { params });
    return response.data.data;
}

export async function fetchOptions() {
    const response = await api.get('/attendance/options');
    return response.data.data;
}

export async function createAttendance(payload) {
    const response = await api.post('/attendance', payload);
    return response.data.data;
}

export async function updateAttendance(id, payload) {
    const response = await api.put(`/attendance/${id}`, payload);
    return response.data.data;
}

export async function deleteAttendance(id) {
    const response = await api.delete(`/attendance/${id}`);
    return response.data;
}

export async function approveAttendance(id) {
    const response = await api.post(`/attendance/${id}/approve`);
    return response.data.data;
}
