import api from '../../../services/api';

export async function fetchDashboardSummary() {
    const response = await api.get('/dashboard/summary');
    return response.data.data;
}