import api from '../../../services/api';

export async function fetchCertificateList(params = {}) {
    const response = await api.get('/certificate', { params });
    return response.data.data;
}

export async function fetchOptions() {
    const response = await api.get('/certificate/options');
    return response.data.data;
}

export async function createCertificate(payload) {
    const response = await api.post('/certificate', payload);
    return response.data.data;
}

export async function updateCertificate(id, payload) {
    const response = await api.put(`/certificate/${id}`, payload);
    return response.data.data;
}

export async function deleteCertificate(id) {
    const response = await api.delete(`/certificate/${id}`);
    return response.data;
}

export async function issueCertificate(id) {
    const response = await api.post(`/certificate/${id}/issue`);
    return response.data.data;
}
