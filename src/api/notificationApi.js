import apiClient from "./client";

export const notificationAPI = {
    sendDeviceToken: async (fcm_token, plateform = "web")=>{
        const res = await apiClient.post("/register-devices", {
            fcm_token,
            plateform
        } )

        return res;
    },

    /**
     * Fetch the latest persisted notifications for the logged-in admin.
     * Returns the raw array of notification rows from the backend.
     */
    getNotifications: async () => {
        const res = await apiClient.get("/notifications");
        return res.data?.data || [];
    },
}