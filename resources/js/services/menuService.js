import api from './api';

export async function fetchSidebarMenu() {
    const response = await api.get('/menu/sidebar');
    return response.data.data;
}