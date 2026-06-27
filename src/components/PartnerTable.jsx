import React, { useState } from 'react';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon, LinkIcon } from '@heroicons/react/24/solid';

const PartnerTable = ({ data, onEdit, onDelete, loading }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  // New state to track which specific row is processing an API call
  const [actionId, setActionId] = useState(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4E1A6F]"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">No partners found. Add your first partner above.</p>
      </div>
    );
  }

  const handleEditClick = (partner) => {
    setEditingId(partner.partner_id);
    setEditedData({ ...partner });
  };

  const handleSave = async () => {
    setActionId(editingId);
    try {
      await onEdit(editingId, editedData);
      setEditingId(null);
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    setActionId(id);
    try {
      await onDelete(id);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Partner Name</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Code</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Integration Link</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Created At</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((partner) => {
            const isEditing = editingId === partner.partner_id;
            const isRowLoading = actionId === partner.partner_id;

            return (
              <tr key={partner.partner_id} className={isEditing ? "bg-purple-50" : "hover:bg-gray-50"}>
                {/* Partner Name */}
                <td className="px-6 py-4">
                  {isEditing ? (
                    <input
                      disabled={isRowLoading}
                      className="w-full p-1 border rounded disabled:bg-gray-50"
                      value={editedData.partner_name}
                      onChange={(e) => setEditedData({ ...editedData, partner_name: e.target.value })}
                    />
                  ) : (
                    <span className="font-medium text-gray-900">{partner.partner_name}</span>
                  )}
                </td>

                {/* Partner Code */}
                <td className="px-6 py-4">
                  {isEditing ? (
                    <input
                      disabled={isRowLoading}
                      className="w-full p-1 border rounded uppercase disabled:bg-gray-50"
                      value={editedData.partner_code}
                      onChange={(e) => setEditedData({ ...editedData, partner_code: e.target.value })}
                    />
                  ) : (
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs text-[#4E1A6F] font-mono">
                      {partner.partner_code}
                    </code>
                  )}
                </td>

                {/* Partner Link */}
                <td className="px-6 py-4">
                  {isEditing ? (
                    <input
                      disabled={isRowLoading}
                      className="w-full p-1 border rounded disabled:bg-gray-50"
                      value={editedData.partner_link}
                      onChange={(e) => setEditedData({ ...editedData, partner_link: e.target.value })}
                    />
                  ) : (
                    <a href={partner.partner_link} target="_blank" rel="noreferrer" className="text-[#4E1A6F] hover:underline flex items-center gap-1">
                      <LinkIcon className="w-4 h-4" />
                      {partner.partner_link}
                    </a>
                  )}
                </td>

                {/* Created At (Read Only) */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(partner.created_at).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {isRowLoading ? (
                      <div className="flex items-center space-x-2 text-[#4E1A6F]">
                        <div className="animate-spin h-4 w-4 border-2 border-[#4E1A6F] border-t-transparent rounded-full"></div>
                        <span className="text-xs font-medium tracking-tight">Updating...</span>
                      </div>
                    ) : isEditing ? (
                      <>
                        <button onClick={handleSave} className="p-1 text-green-600 hover:bg-green-100 rounded">
                          <CheckIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditClick(partner)} className="p-1 text-yellow-600 hover:bg-yellow-100 rounded">
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(partner.partner_id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                          <TrashIcon className="w-5 h-5" />
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

export default PartnerTable;