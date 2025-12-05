import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { userAPI, adminAPI, roleAPI, subscriptionAPI, verificationAPI } from './services/api';
import { announcementAPI, pairAnalysisAPI, partnerAPI } from './services/homeApi';

function App() {
  const { setUsers } = useUserStore();
  const { setAdmins } = useAdminStore();
  const { setPartners } = usePartnerStore();
  const { setRoles } = useRoleStore();
  const { setSubscriptions } = useSubscriptionStore();
  const { setVerifications } = useVerificationStore();
  const { setAnnouncements, setPairAnalysis } = useHomeStore();

  useEffect(() => {
    // Initial data load
    const loadData = async () => {
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
  ]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/admins" element={<Admins />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/verifications" element={<Verifications />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
