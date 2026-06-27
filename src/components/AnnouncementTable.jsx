import React, { useState } from 'react';
import { TrashIcon, CheckIcon, XMarkIcon, PencilIcon, LinkIcon } from '@heroicons/react/24/solid';

const AnnouncementTable = ({ data, onEdit, onDelete, loading }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});

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
          className={`border rounded-lg p-5 transition shadow-sm ${
            isEditing(announcement.announcement_id)
              ? 'bg-purple-50 border-purple-300 ring-1 ring-purple-300'
              : 'bg-white border-gray-200 hover:border-purple-200'
          }`}
        >
          {isEditing(announcement.announcement_id) ? (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-500 uppercase">Title</label>
              <input
                type="text"
                value={editedData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E1A6F] outline-none font-semibold"
              />
              
              <label className="block text-xs font-bold text-gray-500 uppercase">Description</label>
              <textarea
                value={editedData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E1A6F] outline-none resize-none"
              />

              <label className="block text-xs font-bold text-gray-500 uppercase">External Link</label>
              <input
                type="url"
                placeholder="https://..."
                value={editedData.link || ''}
                onChange={(e) => handleChange('link', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E1A6F] outline-none text-sm"
              />

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`active-${announcement.announcement_id}`}
                    checked={editedData.is_active || false}
                    onChange={(e) => handleChange('is_active', e.target.checked)}
                    className="w-4 h-4 text-[#4E1A6F] rounded cursor-pointer"
                  />
                  <label htmlFor={`active-${announcement.announcement_id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                    Active on Mobile App
                  </label>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-1 px-3 py-1.5 hover:bg-gray-200 rounded-md transition text-gray-600 text-sm"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-[#FF9201] hover:bg-[#e08200] rounded-md transition text-white text-sm"
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      {announcement.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                        announcement.is_active
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {announcement.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                    {announcement.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    {announcement.link && (
                      <a 
                        href={announcement.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-xs font-medium text-[#4E1A6F] hover:text-purple-800 bg-purple-50 px-2 py-1 rounded"
                      >
                        <LinkIcon className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">{announcement.link}</span>
                      </a>
                    )}
                    <span className="text-xs text-gray-400">
                      Created: {new Date(announcement.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="p-2 hover:bg-purple-100 rounded-lg transition text-[#4E1A6F] border border-transparent hover:border-purple-200"
                    title="Edit Announcement"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(announcement.announcement_id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition text-red-600 border border-transparent hover:border-red-200"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnnouncementTable;