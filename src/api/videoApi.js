import apiClient from "./client";

export const videoAPI = {
    getAll: async () => {
        const response = await apiClient.get('/tutorial-videos');
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/tutorial-videos', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.put(`/tutorial-videos/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/tutorial-videos/${id}`);
        return response.data;
    },
}


