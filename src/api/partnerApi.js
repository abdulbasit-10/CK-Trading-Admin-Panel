import apiClient from "./client";



export const partnerAPI = {
    getPartners: async () => {
    const response = await apiClient.get(
      `/partners`
      );
    return response.data;
  }, 

  update: async (id, formData) => {
    // formData should contain partner_name, partner_code, partner_link
    const response = await apiClient.put(`/partners/${id}`, formData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/partners/${id}`);
    return response.data;
  },
  create: async (formData) => {
    const response = await apiClient.post("/add-partner", formData);
    return response.data;
  },

}