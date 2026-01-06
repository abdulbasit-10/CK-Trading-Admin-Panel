import React, { useEffect, useState, useCallback } from "react";
import useSubscriptionStore from "../stores/subscriptionStore";
import { subscriptionAPI } from "../api/subscriptionApi";
import { userAPI } from "../api/userApi";
import MainLayout from "../layouts/MainLayout";
import SubscriptionTable from "../components/SubscriptionTable";
import toast from "react-hot-toast";

const Subscriptions = () => {
  const {
    subscriptions,
    loading,
    setSubscriptions,
    setLoading,
    setError,
    error,
  } = useSubscriptionStore();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState(null);
  const [status, setStatus] = useState("");
  const [partners, setPartners] = useState([]);

  // 🔥 NEW: Action-level loading state
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionType, setActionType] = useState(null); // "update" | "delete"

  /* ---------------------------------- FETCH ---------------------------------- */

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await subscriptionAPI.getSubscriptions({
        page,
        limit,
        status,
      });

      setSubscriptions(response.data || []);
      setPagination(response.pagination || null);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, setLoading, setSubscriptions, setError]);

  const fetchPartners = async () => {
    try {
      const response = await userAPI.getPartners();
      setPartners(response.data || []);
    } catch (err) {
      console.error("Failed to fetch partners", err);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchPartners();
  }, [fetchSubscriptions]);

  useEffect(() => {
    setPage(1);
  }, [status]);

  /* ---------------------------------- UPDATE ---------------------------------- */

  const handleUpdate = async (id, updatedData) => {
    try {
      if (
        updatedData.plan_type === "lifetime_free" &&
        !updatedData.partner_user_code
      ) {
        toast.error("Partner User Code is required!");
        return;
      }

      // 🔹 START row loading
      setActionLoadingId(id);
      setActionType("update");

      await subscriptionAPI.updateSubscription(id, updatedData);
      await fetchSubscriptions();

      toast.success("Subscription updated successfully");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update subscription"
      );
    } finally {
      // 🔹 STOP row loading
      setActionLoadingId(null);
      setActionType(null);
    }
  };


  /* ---------------------------------- DELETE ---------------------------------- */

  const handleDeleteSubscription = async (subscriptionId) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;

    const toastId = toast.loading("Deleting subscription...");
    setActionLoadingId(subscriptionId);
    setActionType("delete");

    try {
      await subscriptionAPI.deleteSubscription(subscriptionId);
      toast.success("Subscription deleted successfully", { id: toastId });
      await fetchSubscriptions();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete subscription",
        { id: toastId }
      );
    } finally {
      setActionLoadingId(null);
      setActionType(null);
    }
  };

  /* -------------------------------- PAGINATION -------------------------------- */

  const handleNextPage = () => {
    if (pagination && page < pagination.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Subscriptions Management
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage user subscriptions
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Subscriptions List
            </h2>
            {pagination && (
              <p className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 items-center p-6 border-b border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <SubscriptionTable
            data={subscriptions}
            partners={partners}
            loading={loading}
            onEdit={handleUpdate}
            onDelete={handleDeleteSubscription}
            actionLoadingId={actionLoadingId}
            actionType={actionType}
          />

          {pagination && pagination.totalPages > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <span className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.total
                )}{" "}
                of {pagination.total}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1 || loading}
                  className="px-4 py-2 text-sm rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page >= pagination.totalPages || loading}
                  className="px-4 py-2 text-sm rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Subscriptions;
