import api from '../../../../services/api';

export async function fetchAuditLogs(params = {}) {
    const response = await api.get('/admin/audit-logs', { params });
    return response.data.data;
}

export async function fetchFilterOptions() {
    const response = await api.get('/admin/audit-logs/filter-options');
    return response.data.data;
}

export async function fetchAuditLogDetail(id) {
    const response = await api.get(`/admin/audit-logs/${id}`);
    return response.data.data;
}