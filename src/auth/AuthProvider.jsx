// src/auth/AuthProvider.js
import { useState, useEffect, useRef } from "react";
import { apiClient } from "../api";
import AuthContext from "./AuthContext";
import { setAccessToken } from "../api";

// Persisted "user explicitly logged out" flag. We need this in
// localStorage (not just a ref) because the refresh-token cookie is
// HttpOnly and cannot be cleared from JS. If the backend logout call
// fails (e.g. endpoint missing/404, network error) the cookie survives
// the page reload and `/auth/refresh` would silently re-authenticate
// the user. This flag lets `initAuth` short-circuit that.
const LOGGED_OUT_KEY = "ck_admin_logged_out";

const readLoggedOut = () => {
  try {
    return localStorage.getItem(LOGGED_OUT_KEY) === "1";
  } catch {
    return false;
  }
};

const writeLoggedOut = (value) => {
  try {
    if (value) localStorage.setItem(LOGGED_OUT_KEY, "1");
    else localStorage.removeItem(LOGGED_OUT_KEY);
  } catch {
    /* storage may be disabled; nothing we can do */
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // In-memory mirror of the persisted flag, used to short-circuit
  // any late `/auth/refresh` calls fired in the same tab after logout.
  const loggedOutRef = useRef(readLoggedOut());

  /**
   * LOGIN
   */
  const login = async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    const { accessToken, user } = response.data;

    loggedOutRef.current = false;
    writeLoggedOut(false);
    setAccessToken(accessToken);
    setUser(user);
    return user;
  };

  /**
   * LOGOUT
   * Always call the backend first so it clears the HttpOnly refresh-token
   * cookie. Without this, the cookie survives and `initAuth` would silently
   * log the user back in on the next page refresh. If the backend call
   * fails for any reason, we still mark the user as logged out locally
   * so the UI (and subsequent page refreshes) behave correctly.
   */
  const logout = async () => {
    loggedOutRef.current = true;
    writeLoggedOut(true);

    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Backend may be unreachable or the endpoint may not be deployed
      // yet. The persisted `LOGGED_OUT_KEY` above guarantees we won't
      // auto-refresh into the account on next page load.
    }

    setAccessToken(null);
    setUser(null);
  };


  const initAuth = async () => {
    // If the user explicitly logged out (this tab, or a previous
    // session that persisted the flag) don't try to silently re-auth.
    if (loggedOutRef.current || readLoggedOut()) {
      setAccessToken(null);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post("/auth/refresh");
      const { accessToken, user } = response.data;

      setAccessToken(accessToken);
      setUser(user);
    } catch {
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
