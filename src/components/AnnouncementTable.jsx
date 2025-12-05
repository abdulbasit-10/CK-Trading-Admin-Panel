import React, { useState } from 'react';
import { TrashIcon, CheckIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/solid';

const AnnouncementTable = ({ data, onEdit, onDelete, loading }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No announcements available</p>
      </div>
    );
  }

  const handleEdit = (row) => {
    setEditingId(row.announcement_id);
    setEditedData({ ...row });
  };

  const handleSave = () => {
    onEdit(editingId, editedData);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const isEditing = (id) => editingId === id;

  return (
    <div className="space-y-4">
      {data.map((announcement) => (
        <div
          key={announcement.announcement_id}
          className={`border rounded-lg p-4 transition ${
            isEditing(announcement.announcement_id)
              ? 'bg-blue-50 border-blue-300'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          {isEditing(announcement.announcement_id) ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editedData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-lg"
              />
              <textarea
                value={editedData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editedData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Active</span>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleSave}
                  className="p-2 hover:bg-green-100 rounded-lg transition text-green-600"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600 mt-2">{announcement.message}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        announcement.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {announcement.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => handleEdit(announcement)}
                  className="p-2 hover:bg-yellow-100 rounded-lg transition text-yellow-600"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(announcement.announcement_id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnnouncementTable;
