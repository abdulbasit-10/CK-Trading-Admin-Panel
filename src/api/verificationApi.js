import apiClient from "./client";

export const verificationAPI = {
  getByStatus: async (status, page = 1) => {
    const response = await apiClient.get(
      `/verifications?status=${status}&page=${page}`
    );
    return response.data;
  },

  getPartners: async () => {
    const response = await apiClient.get(
      `/partners`
    );
    return response.data;
  },

  reviewSubscription: async (data) => {
    const response = await apiClient.post(
      '/review/subscription',
      data
    );
    return response.data;


  }



}