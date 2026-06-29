import React, { useState } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import Button from "./Button";

/* ---------- Helpers ---------- */
const safeCapitalize = (value) =>
  typeof value === "string" && value.length > 0
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : "—";

const VerificationCard = ({
  verification,
  user,
  partners = [],
  onApprove,
  onReject,
  onViewImage,
}) => {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isConfirmingReject, setIsConfirmingReject] = useState(false);

  const [planSelection, setPlanSelection] = useState("monthly");
  const [selectedPartnerId, setSelectedPartnerId] = useState("");
  const [partnerCode, setPartnerCode] = useState("");

  /* ---------- Handlers ---------- */
  const handleApprove = async () => {
    if (planSelection === "partner" && (!selectedPartnerId || !partnerCode)) {
      alert("Partner and partner code are required");
      return;
    }

    setIsApproving(true);
    try {
      await onApprove({
        verification_id: verification.verification_id,
        action: "approved",
        decided_plan_type: planSelection,
        partner_id: planSelection === "partner" ? selectedPartnerId : null,
        partner_user_code: planSelection === "partner" ? partnerCode : null,
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectComment.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setIsConfirmingReject(true);
    try {
      await onReject({
        verification_id: verification.verification_id,
        action: "rejected",
        comment: rejectComment,
      });

      setIsRejecting(false);
      setRejectComment("");
    } finally {
      setIsConfirmingReject(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const isPending = verification.review_status === "pending";

  /* ---------- UI ---------- */

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {user?.full_name ?? "—"}
            </h3>
            <p className="text-sm text-gray-500">{user?.email ?? "—"}</p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              verification.review_status
            )}`}
          >
            {safeCapitalize(verification.review_status)}
          </span>
        </div>

        {/* Plan Selection (Pending Only) */}
        {isPending && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
            {/* Plan Type */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Select Plan Type
              </label>
              <select
                value={planSelection}
                onChange={(e) => setPlanSelection(e.target.value)}
                disabled={isApproving}
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="partner">Partner</option>
              </select>
            </div>

            {/* Partner Fields */}
            {planSelection === "partner" && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Select Partner
                  </label>
                  <select
                    value={selectedPartnerId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedPartnerId(id);
                    }}
                    disabled={isApproving}
                    className="w-full mt-1 px-3 py-2 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a partner</option>
                    {partners.map((p) => (
                      <option key={p.partner_id} value={p.partner_id}>
                        {p.partner_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Partner Code
                  </label>
                  <input
                    type="text"
                    value={partnerCode}
                    onChange={(e) => setPartnerCode(e.target.value)}
                    placeholder="Enter partner code"
                    disabled={isApproving}
                    className="w-full mt-1 px-3 py-2 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </>
            )}

            {/* Submitted Date */}
            <div className="flex justify-between pt-2 border-t text-sm">
              <span className="text-gray-600">Submitted:</span>
              <span className="font-medium">
                {new Date(verification.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* Screenshot */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Payment Proof
          </p>
          <div
            className="relative group cursor-pointer"
            onClick={() => onViewImage(verification)}
          >
            <img
              src={`${verification.screenshot_url}`}
              alt="Payment proof"
              className="w-full h-48 object-cover rounded-lg border"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <EyeIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Rejection Reason */}
        {verification.review_status === "rejected" && verification.review_comment && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-700 mb-1">Rejection Reason:</p>
            <p className="text-sm text-red-600">{verification.review_comment}</p>
          </div>
        )}

        {/* Actions */}
        {isPending && (
          <div className="space-y-3">
            {!isRejecting ? (
              <div className="flex space-x-3">
                <Button
                  variant="success"
                  className="flex-1"
                  onClick={handleApprove}
                  loading={isApproving}
                  disabled={isApproving}
                >
                  <CheckCircleIcon className="w-4 h-4 mr-1" /> Approve
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={() => setIsRejecting(true)}
                  disabled={isApproving}
                >
                  <XCircleIcon className="w-4 h-4 mr-1" /> Reject
                </Button>
              </div>
            ) : (
              <>
                <textarea
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  rows={3}
                  disabled={isConfirmingReject}
                  className="w-full px-3 py-2 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="flex space-x-2">
                  <Button
                    variant="danger"
                    onClick={handleReject}
                    loading={isConfirmingReject}
                    disabled={isConfirmingReject}
                  >
                    Confirm Reject
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsRejecting(false)}
                    disabled={isConfirmingReject}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationCard;