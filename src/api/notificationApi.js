import apiClient from "./client";

export const notificationAPI = {
    sendDeviceToken: async (fcm_token, plateform = "web")=>{
        const res = await apiClient.post("/register-devices", {
            fcm_token,
            plateform
        } )

        return res;
    }
}