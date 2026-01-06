import apiClient from "./client";

export const subscriptionAPI = {
  getSubscriptions: async ({ page = 1, limit = 10, status }) => {
    const params = new URLSearchParams({
      page,
      limit,
    });

    if (status) params.append("status", status);

    const response = await apiClient.get(
      `/admin/dashboard/subscriptions?${params.toString()}`
    );

    return response.data;
  },
  updateSubscription: async (id, updateData) => {
    // We send the subscription_id in the URL and the data in the body
    const response = await apiClient.put(`/admin/dashboard/subscriptions/${id}`, updateData);
    return response.data;
  },

  deleteSubscription: async (id) => {
    const response = await apiClient.delete(`/admin/dashboard/subscriptions/${id}`);
    return response.data;
  },

};
