import api from '../../../../services/api';

export async function fetchAllMenus() {
    const response = await api.get('/admin/menus');
    return response.data.data;
}

export async function fetchTopLevelMenus() {
    const response = await api.get('/admin/menus/top-level');
    return response.data.data;
}

export async function createMenu(payload) {
    const response = await api.post('/admin/menus', payload);
    return response.data.data;
}

export async function updateMenu(id, payload) {
    const response = await api.put(`/admin/menus/${id}`, payload);
    return response.data.data;
}

export async function deleteMenu(id) {
    const response = await api.delete(`/admin/menus/${id}`);
    return response.data;
}