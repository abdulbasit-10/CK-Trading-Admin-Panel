import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, EyeIcon } from '@heroicons/react/24/solid';
import Button from './Button';

const VerificationCard = ({
  verification,
  user,
  subscription,
  partner,
  onApprove,
  onReject,
  onViewImage,
}) => {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectComment, setRejectComment] = useState('');

  const handleApprove = async () => {
    await onApprove(verification.verification_id);
  };

  const handleReject = async () => {
    if (!rejectComment.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    await onReject(verification.verification_id, rejectComment);
    setIsRejecting(false);
    setRejectComment('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getVerificationTypeLabel = (type) => {
    return type === 'subscription' ? 'Subscription Payment' : 'Partner Payment';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{user?.full_name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              verification.status
            )}`}
          >
            {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
          </span>
        </div>

        {/* Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Verification Type:</span>
            <span className="text-sm font-medium text-gray-900">
              {getVerificationTypeLabel(verification.verification_type)}
            </span>
          </div>

          {verification.verification_type === 'subscription' && subscription && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Plan:</span>
              <span className="text-sm font-medium text-gray-900 capitalize">
                {subscription.plan_type}
              </span>
            </div>
          )}

          {verification.verification_type === 'partner' && partner && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Partner:</span>
              <span className="text-sm font-medium text-gray-900">
                {partner.partner_name}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Submitted:</span>
            <span className="text-sm font-medium text-gray-900">
              {new Date(verification.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Screenshot Preview */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Payment Proof</p>
          <div className="relative group cursor-pointer">
            <img
              src={verification.screenshot_url}
              alt="Payment proof"
              className="w-full h-48 object-cover rounded-lg border border-gray-300"
              onClick={() => onViewImage(verification)}
            />
            <div
              onClick={() => onViewImage(verification)}
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <EyeIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Review Comment */}
        {verification.review_comment && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs font-medium text-blue-900 mb-1">Admin Comment:</p>
            <p className="text-sm text-blue-800">{verification.review_comment}</p>
          </div>
        )}

        {/* Actions */}
        {verification.status === 'pending' && (
          <div className="space-y-3">
            {!isRejecting ? (
              <div className="flex space-x-3">
                <Button
                  variant="success"
                  size="md"
                  className="flex-1"
                  onClick={handleApprove}
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  className="flex-1"
                  onClick={() => setIsRejecting(true)}
                >
                  <XCircleIcon className="w-4 h-4" />
                  Reject
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none text-sm"
                  rows="3"
                />
                <div className="flex space-x-2">
                  <Button
                    variant="danger"
                    size="sm"
                    className="flex-1"
                    onClick={handleReject}
                  >
                    Confirm Reject
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setIsRejecting(false);
                      setRejectComment('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationCard;
