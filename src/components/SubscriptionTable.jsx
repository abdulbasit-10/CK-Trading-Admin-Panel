import React, { useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const statusStyles = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  expired: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-700",
};

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : "—";

// 🔹 Row-level spinner
const RowSpinner = () => (
  <div className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
);

const SubscriptionTable = ({
  data = [],
  partners = [],
  loading,
  onEdit,
  onDelete,
  actionLoadingId,
  actionType,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4E1A6F]"></div>
      </div>
    );
  }

  const startEditing = (sub) => {
    setEditingId(sub.subscription_id);
    setEditFormData({
      plan_type: sub.plan_type,
      partner_id: sub.partner_id || "",
      partner_user_code: sub.partner_user_code || "",
      status: sub.status,
      end_date: sub.end_date ? sub.end_date.split("T")[0] : "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSave = () => {
    if (
      editFormData.plan_type === "lifetime_free" &&
      (!editFormData.partner_id || !editFormData.partner_user_code)
    ) {
      alert("Partner and Partner Code are required for Lifetime Free plan");
      return;
    }

    onEdit(editingId, editFormData);
    setEditingId(null);
  };

  const handlePlanChange = (value) => {
    setEditFormData((prev) => ({
      ...prev,
      plan_type: value,
      partner_id: value === "lifetime_free" ? prev.partner_id : "",
      partner_user_code: value === "lifetime_free" ? prev.partner_user_code : "",
      end_date: value === "lifetime_free" ? "" : prev.end_date,
    }));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1200px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              User
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Plan
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Partner
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Partner Code
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              End Date
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((sub) => {
            const isEditing = editingId === sub.subscription_id;
            const isRowLoading = actionLoadingId === sub.subscription_id;
            const isDeleting = isRowLoading && actionType === "delete";
            const isUpdating = isRowLoading && actionType === "update";

            return (
              <tr
                key={sub.subscription_id}
                className={`border-b border-gray-200 transition ${
                  isRowLoading ? "opacity-60 pointer-events-none" : "hover:bg-gray-50"
                }`}
              >
                {/* User */}
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">
                    {sub.full_name}
                  </div>
                  <div className="text-xs text-gray-500">{sub.email}</div>
                </td>

                {/* Plan */}
                <td className="px-4 py-3 text-sm">
                  {isEditing ? (
                    <select
                      className="border rounded px-2 py-1 w-full"
                      value={editFormData.plan_type}
                      onChange={(e) => handlePlanChange(e.target.value)}
                      disabled={isRowLoading}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="lifetime_free">Lifetime Free</option>
                    </select>
                  ) : (
                    <span className="capitalize">
                      {sub.plan_type?.replace("_", " ")}
                    </span>
                  )}
                </td>

                {/* Partner */}
                <td className="px-4 py-3 text-sm">
                  {isEditing ? (
                    <select
                      className="border rounded px-2 py-1 w-full disabled:bg-gray-100"
                      disabled={isRowLoading || editFormData.plan_type !== "lifetime_free"}
                      value={editFormData.partner_id}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, partner_id: e.target.value })
                      }
                    >
                      <option value="">
                        {editFormData.plan_type === "lifetime_free" ? "Select Partner" : "N/A"}
                      </option>
                      {partners.map((partner) => (
                        <option key={partner.partner_id} value={partner.partner_id}>
                          {partner.partner_name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{sub.partner_name || "—"}</span>
                  )}
                </td>

                {/* Partner Code */}
                <td className="px-4 py-3 text-sm">
                  {isEditing ? (
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-full disabled:bg-gray-100"
                      disabled={isRowLoading || editFormData.plan_type !== "lifetime_free"}
                      placeholder={
                        editFormData.plan_type === "lifetime_free" ? "Enter code" : "N/A"
                      }
                      value={editFormData.partner_user_code}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, partner_user_code: e.target.value })
                      }
                    />
                  ) : (
                    <span className="font-mono text-[#4E1A6F]">
                      {sub.partner_user_code || "—"}
                    </span>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-sm">
                  {isEditing ? (
                    <select
                      className="border rounded px-2 py-1 w-full"
                      value={editFormData.status}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, status: e.target.value })
                      }
                      disabled={isRowLoading}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="expired">Expired</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusStyles[sub.status]
                      }`}
                    >
                      {sub.status}
                    </span>
                  )}
                </td>

                {/* End Date */}
                <td className="px-4 py-3 text-sm text-gray-600">
                  {isEditing ? (
                    <input
                      type="date"
                      className="border rounded px-2 py-1 w-full disabled:bg-gray-100"
                      disabled={isRowLoading || editFormData.plan_type === "lifetime_free"}
                      value={editFormData.end_date}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, end_date: e.target.value })
                      }
                    />
                  ) : sub.plan_type === "lifetime_free" ? (
                    "∞"
                  ) : (
                    formatDate(sub.end_date)
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    {isRowLoading ? (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <RowSpinner />
                        {isDeleting ? "Deleting..." : "Saving..."}
                      </div>
                    ) : isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        >
                          <CheckIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(sub)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(sub.subscription_id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionTable;
