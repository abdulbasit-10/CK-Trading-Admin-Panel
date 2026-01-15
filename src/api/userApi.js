import apiClient from "./client";


export const userAPI = {
    addUser: async (data) => {
        const res = apiClient.post("/admin/dashboard/add-user", data )
        return res.data;

    },
    getAll: async (page, limit) => {
        const res = apiClient.get(`/admin/dashboard/paginated-users?page=${page}&limit=${limit}`)
        return res;
    },
    deleteUser: async (id) => {
        const res = apiClient.delete(`/admin/dashboard/delete-user/${id}`)
        return res.data;
    }  ,
    getPartners: async () => {
    const response = await apiClient.get(
      `/partners`
    );
    return response.data;
  }, 


}
