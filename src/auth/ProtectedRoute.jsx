// src/auth/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";
import  LoadingScreen  from "../components/LoadingScreen.jsx";



const ProtectedRoute = ({ children, roles, requireSubscription }) => {
  const { user, loading } = useAuth();

  // 1️⃣ Still checking auth (refresh in progress)
  if (loading) {
  return (
    <LoadingScreen/>
  );
}


  // 2️⃣ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ Role-based access
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4️⃣ Subscription-based access
  if (requireSubscription) {
    const sub = user.subscription;

    if (
      !sub ||
      sub.status !== "active" ||
      (sub.expiry && new Date(sub.expiry) < new Date())
    ) {
      return <Navigate to="/billing" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
