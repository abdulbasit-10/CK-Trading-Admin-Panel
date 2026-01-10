import apiClient from "./client";

export const resultAPI = {
  createResult: async (data) => {
    const response = await apiClient.post(
      "/post-result",
      data

    );
    return response.data;
  },

  getAll: ({ page = 1, limit = 10, filter = "all" }) =>
    apiClient.get(
      `/results?page=${page}&limit=${limit}&filter=${filter}`
    ),

  update: async (id, data) => {
    const response = await apiClient.put(`/results/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/results/${id}`);
    return response.data;
  },


}