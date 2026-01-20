import apiClient from "./client";

export const trustWalletApi = {
    getCredentials: async () =>{
        const response = await apiClient.get("/trust-wallet");
        return response.data;
    },
    updateCredentials: async (payload) =>{
        const response = await apiClient.put("/trust-wallet", payload);
        return response.data;
    }

};