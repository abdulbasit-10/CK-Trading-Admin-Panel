// src/auth/AuthProvider.js
import { useState, useEffect } from "react";
import { apiClient } from "../api";
import AuthContext from "./AuthContext";
import { setAccessToken } from "../api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * LOGIN
   */
  const login = async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    const { accessToken, user } = response.data;

    setAccessToken(accessToken);
    setUser(user);
    return user;
  };

  /**
   * LOGOUT
   */
  const logout = async () => {
    try {
      // Optional backend logout endpoint
      await apiClient.post("/auth/logout");
    } catch (_) { }

    setAccessToken(null);
    setUser(null);
  };


  const initAuth = async () => {
  try {
    const response = await apiClient.post("/auth/refresh");
    const { accessToken, user } = response.data;
    
    setAccessToken(accessToken);
    setUser(user);
  } catch (error) {
    setAccessToken(null);
    setUser(null);
  } finally {
    setLoading(false); 
  }
};



  useEffect(() => {
    initAuth();

    const handleSessionExpired = () => {
      setAccessToken(null);
      setUser(null);
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => window.removeEventListener("auth:session-expired", handleSessionExpired);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
