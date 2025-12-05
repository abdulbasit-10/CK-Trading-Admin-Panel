import React, { useState, useEffect } from 'react';
import useVerificationStore from '../stores/verificationStore';
import { verificationAPI } from '../services/api';
import { userAPI } from '../services/api';
import { subscriptionAPI } from '../services/api';
import { partnerAPI } from '../services/homeApi';
import MainLayout from '../layouts/MainLayout';
import VerificationCard from '../components/VerificationCard';
import VerificationModal from '../components/VerificationModal';

const Verifications = () => {
  const {
    verifications,
    loading,
    setVerifications,
    setLoading,
    setError,
    error,
    updateVerification,
  } = useVerificationStore();

  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [partners, setPartners] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [verificationsData, usersData, subscriptionsData, partnersData] =
        await Promise.all([
          verificationAPI.getAll(),
          userAPI.getAll(),
          subscriptionAPI.getAll(),
          partnerAPI.getAll(),
        ]);
      setVerifications(verificationsData);
      setUsers(usersData);
      setSubscriptions(subscriptionsData);
      setPartners(partnersData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (verificationId) => {
    setActionLoading(true);
    try {
      await verificationAPI.approve(verificationId, 'Approved by admin');
      fetchData();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (verificationId, comment) => {
    setActionLoading(true);
    try {
      await verificationAPI.reject(verificationId, comment);
      fetchData();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getUser = (userId) => users.find(u => u.user_id === userId);
  const getSubscription = (subscriptionId) =>
    subscriptions.find(s => s.subscription_id === subscriptionId);
  const getPartner = (partnerId) => partners.find(p => p.partner_id === partnerId);

  const filteredVerifications =
    statusFilter === 'all'
      ? verifications
      : verifications.filter(v => v.status === statusFilter);

  const pendingCount = verifications.filter(v => v.status === 'pending').length;
  const approvedCount = verifications.filter(v => v.status === 'approved').length;
  const rejectedCount = verifications.filter(v => v.status === 'rejected').length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Verifications</h1>
          <p className="text-gray-600 mt-2">Review and approve payment proofs</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Approved</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{approvedCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <p className="text-gray-600 text-sm">Rejected</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{rejectedCount}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Verifications Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredVerifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No verifications found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredVerifications.map((verification) => (
              <VerificationCard
                key={verification.verification_id}
                verification={verification}
                user={getUser(verification.user_id)}
                subscription={getSubscription(verification.subscription_id)}
                partner={getPartner(verification.partner_id)}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewImage={setSelectedImage}
              />
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <VerificationModal verification={selectedImage} onClose={() => setSelectedImage(null)} />
    </MainLayout>
  );
};

export default Verifications;
