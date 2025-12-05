import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const VerificationModal = ({ verification, onClose }) => {
  if (!verification) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Payment Proof</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            <img
              src={verification.screenshot_url}
              alt="Payment proof"
              className="w-full max-h-96 object-contain rounded-lg"
            />
            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Submitted:</strong>{' '}
                {new Date(verification.created_at).toLocaleString()}
              </p>
              {verification.status === 'pending' && (
                <p className="mt-2 text-yellow-700 bg-yellow-50 px-3 py-2 rounded">
                  Pending review
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
