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

  delete: (id) =>
    apiClient.delete(`/results/${id}`)
    
}