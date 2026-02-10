import apiClient from "./client";

export const announcementAPI = {
  getAll: async (page = 1) => {
    const response = await apiClient.get(
      `/announcements/active?page=${page}`
    );
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post(`/announcements`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/announcements/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/announcements/${id}`);
    return response.data;
  },

  deleteAll: async () => {
    const response = await apiClient.delete(`/announcements/delete/all`);
    return response.data;
  },


};


export const pairAnalysisAPI = {
  // Create analysis pair (multipart because of image)
  create: async (formData) => {
    const response = await apiClient.post(
      "/admin/create-analysis-pair", // 👈 use your actual backend route
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // (Optional) future APIs
  getAll: async (page = 1) => {
    const response = await apiClient.get(
      `/analysis-pairs?page=${page}`
    );
    return response.data;
  },

  getByCategory: async (category, page = 1) => {
    const response = await apiClient.get(
      `/admin/analysis-pairs/${category}?page=${page}`
    );
    // Based on your backend code: return response.data.analysis_pairs
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/admin/delete-analysis/${id}`);
    return response.data;
  },

  deleteAllByCategory: async (category) => {
    const response = await apiClient.delete(
      `/admin/delete-all-analysis?category=${category}`
    );
    return response.data;
  },

};

export const signalAPI = {
  createSignal: async (formData) => {
    const response = await apiClient.post(
      "/create-signal",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  getSignals: async (page = 1, limit = 10) => {
    const response = await apiClient.get("/admin/signals", {
      params: { page, limit },
    });
    return response.data;
  },

  deleteSignal: async (id) => {
    const response = await apiClient.delete(`/delete-signal/${id}`);
    return response.data;
  },

  updateSignal: async (id, formData) => {
    const response = await apiClient.put(
      `/update-signal/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteAllSignals: async () => {
    const response = await apiClient.delete("/delete-all-signals");
    return response.data;
  },



};