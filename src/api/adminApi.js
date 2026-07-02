import apiClient from "./client";


export const adminAPI = {
    getAdmins: async  (page, limit) => {
        const res = await apiClient.get(`/admin/dashboard/admin-users`)
        return res.data;
    },

    createAdmin: async (data) => {
        const res = await apiClient.post("/admin/dashboard/create-admin", data )
        return res.data;
    },

    update: async (id, data) => {
        const res = await apiClient.put(`/admin/dashboard/update-admin/${id}`, data);
        return res.data;
    },

    getRole: async () =>{
        const res = await apiClient.get("/admin/dashboard/get-roles")
        return res.data;
    },

    deleteAdmin: async (id) => {
        const res = await apiClient.delete(`/admin/dashboard/delete-admin/${id}`)
        return res.data;
    }
}

