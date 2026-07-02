// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import useAuth from "../auth/useAuth";

const LoginPage = () => {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  // While the auth check is in progress show nothing (prevents flash).
  if (loading) return null;

  // If already authenticated, send straight to the dashboard.
  // This covers the "refresh on /login after logout failed to clear cookie"
  // scenario — if initAuth succeeds the user is redirected here before
  // the login form ever renders.
  if (user) return <Navigate to="/" replace />;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    try {
      const loggedInUser = await login(email, password);

      // Role check (optional, extra safety)
      if (!["admin", "super_admin"].includes(loggedInUser.role)) {
        throw new Error("Access denied");
      }

      navigate("/", { replace: true });
    } catch (err) {
      const status = err.response?.status;
      if (status === 429) {
        setError(
          err.response?.data?.message ||
            "Too many login attempts. Please wait a few minutes and try again."
        );
      } else {
        setError(err.response?.data?.message || err.message || "Login failed");
      }
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="w-full py-2 text-white bg-[#FF9201] rounded-md disabled:opacity-50"
          >
            {formLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
