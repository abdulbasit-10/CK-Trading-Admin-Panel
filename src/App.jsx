import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Users from './pages/Users';
import Admins from './pages/Admins';
import Subscriptions from './pages/Subscriptions';
import Partners from './pages/Partners';
import Verifications from './pages/Verifications';
import useUserStore from './stores/userStore';
import useAdminStore from './stores/adminStore';
import usePartnerStore from './stores/partnerStore';
import useRoleStore from './stores/roleStore';
import useSubscriptionStore from './stores/subscriptionStore';
import useVerificationStore from './stores/verificationStore';
import useHomeStore from './stores/homeStore';
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import Result from './pages/Results';
import { userAPI, adminAPI, roleAPI, subscriptionAPI, verificationAPI } from './services/api';
import { announcementAPI, pairAnalysisAPI, partnerAPI } from './services/homeApi';
import userAuth from './auth/useAuth';
import ProtectedRoute from './auth/ProtectedRoute';
import TrustWalletAdminPage from './pages/TrustWalletPage';
import TutorialVideoPage from './pages/ToturialVideos';


function App() {
  const { setUsers } = useUserStore();
  const { setAdmins } = useAdminStore();
  const { setPartners } = usePartnerStore();
  const { setRoles } = useRoleStore();
  const { setSubscriptions } = useSubscriptionStore();
  const { setVerifications } = useVerificationStore();
  const { setAnnouncements, setPairAnalysis } = useHomeStore();
  const { isAuthenticated, login, userRole } = userAuth(); // Now pulls the correct values




  useEffect(() => {
    // Initial data load
    const loadData = async () => {
      if (!isAuthenticated) {
        console.log('User not authenticated. Skipping initial data load.');
        return;
      }
      try {
        const [
          userData,
          adminData,
          partnerData,
          roleData,
          subscriptionData,
          verificationData,
          announcementData,
          analysisData,
        ] = await Promise.all([
          userAPI.getAll(),
          adminAPI.getAll(),
          partnerAPI.getAll(),
          roleAPI.getAll(),
          subscriptionAPI.getAll(),
          verificationAPI.getAll(),
          announcementAPI.getAll(),
          pairAnalysisAPI.getAll(),
        ]);
        setUsers(userData || []);
        setAdmins(adminData || []);
        setPartners(partnerData || []);
        setRoles(roleData || []);
        setSubscriptions(subscriptionData || []);
        setVerifications(verificationData || []);
        setAnnouncements(announcementData || []);
        setPairAnalysis(analysisData || []);
      } catch (error) {
        console.error('Failed to load initial data:', error.message);
        // Data will be loaded from mock data in api.js
      }
    };

    loadData();
  }, [
    setUsers,
    setAdmins,
    setPartners,
    setRoles,
    setSubscriptions,
    setVerifications,
    setAnnouncements,
    setPairAnalysis,
    isAuthenticated,
  ]);

  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <Router>
      <Routes>

        {/* Authentication Routes (Public/Unprotected) */}
        <Route path='/login' element={
          isAuthenticated ? (
            <Navigate to="/" />
          ) : (<LoginPage onSuccessfulLogin={login} />)
        } />

        <Route path='/register' element={
          isAuthenticated ? (
            <Navigate to="/" />
          ) : (<RegisterPage onSuccessfulRegistration={() => { }} />)
        } />

        {/* Protected Admin Routes (FIX 2 applied) */}
        <Route
          path="/"
          element={
            <ProtectedRoute roles={["admin", "super_admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute roles={["admin", "super_admin"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["admin", "super_admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admins"
          element={
            <ProtectedRoute roles={["super_admin"]}>
              <Admins />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute roles={["admin", "super_admin"]} >
              <Subscriptions />
            </ProtectedRoute>} />
        <Route path="/partners" element={<ProtectedRoute roles={["admin", "super_admin"]} >
          <Partners />
        </ProtectedRoute>
        } />
        <Route path="/verifications" element={<ProtectedRoute roles={["admin", "super_admin"]} >
          <Verifications />
        </ProtectedRoute>
        } />
        <Route
          path="/results"
          element={<ProtectedRoute roles={["admin", "super_admin"]}>
            <Result />
          </ProtectedRoute>
          } />

        <Route
          path="/trust-wallet"
          element={
            <ProtectedRoute roles={["super_admin", "admin"]}>
              <TrustWalletAdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tutorial-videos"
          element={
            <ProtectedRoute roles={["admin", "super_admin"]}>
              <TutorialVideoPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: Redirects to Dashboard if authenticated, otherwise to login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
