import React, { useState, useEffect } from "react";
import useVerificationStore from "../stores/verificationStore";
import MainLayout from "../layouts/MainLayout";
import VerificationCard from "../components/VerificationCard";
import VerificationModal from "../components/VerificationModal";
import { verificationAPI } from "../api/verificationApi";

const Verifications = () => {
  const {
    verifications,
    loading,
    setVerifications,
    setLoading,
    setError,
    error,
  } = useVerificationStore();

  const [subscriptions, setSubscriptions] = useState([]);
  const [partners, setPartners] = useState([]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  /* ---------------- Effects ---------------- */

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  // Fetch data
  useEffect(() => {
    fetchVerifications();
    fetchPartners();
  }, [statusFilter, page]);

  /* ---------------- API Calls ---------------- */

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const response = await verificationAPI.getByStatus(
        statusFilter,
        page
      );

      setVerifications(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch verifications");
    } finally {
      setLoading(false);
    }
  };

  const fetchPartners = async () => {
    try {
      const response = await verificationAPI.getPartners();
      setPartners(response.data);
    } catch (err) {
      console.error("Failed to fetch partners", err);
    }
  };

  /* ---------------- Actions ---------------- */

  const handleApprove = async (payload) => {
    setActionLoading(true);
    try {
      await verificationAPI.reviewSubscription(payload);
      fetchVerifications(); // refresh list
    } catch (err) {
      setError(err.message || "Failed to approve subscription");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (payload) => {
    setActionLoading(true);
    try {
      await verificationAPI.reviewSubscription(payload);
      fetchVerifications();
    } catch (err) {
      setError(err.message || "Failed to reject subscription");
    } finally {
      setActionLoading(false);
    }
  };


  /* ---------------- Helpers ---------------- */

  const getSubscription = (subscriptionId) =>
    subscriptions.find((s) => s.subscription_id === subscriptionId);
  const getPartner = (partnerId) =>
    partners.find((p) => p.partner_id === partnerId);

  /* ---------------- UI ---------------- */

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Verifications</h1>
          <p className="text-gray-600 mt-2">
            Review and approve payment proofs
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}

        {/* Filter */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E1A6F] outline-none"
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4E1A6F]" />
          </div>
        ) : verifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No verifications found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {verifications.map((verification) => (
              <VerificationCard
                key={verification.verification_id}
                verification={verification}
                user={verification.user}
                subscription={getSubscription(verification.subscription_id)}
                partner={getPartner(verification.partner_id)}
                partners={partners}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewImage={setSelectedImage}
                loading={actionLoading}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <div className="flex justify-center space-x-3 mt-6">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="px-4 py-2 text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <VerificationModal
        verification={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </MainLayout>
  );
};

export default Verifications;
