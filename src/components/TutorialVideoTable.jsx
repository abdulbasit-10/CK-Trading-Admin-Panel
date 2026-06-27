import React, { useState } from "react";
import { Pencil, Trash2, Check, X, ExternalLink } from "lucide-react";

const TutorialVideoTable = ({ videos = [], onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  if (!videos.length) {
    return <div className="text-center text-gray-500 py-6">No tutorial videos found</div>;
  }

  const startEdit = (item) => {
    setEditingId(item.id); // Using 'id' from your PostgreSQL schema
    setEditData({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(editingId, editData);
    setEditingId(null);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Video Title</th>
            <th className="px-4 py-3 text-left font-medium">Link</th>
            <th className="px-4 py-3 text-left font-medium">Created At</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {videos.map((item) => {
            const isEditing = editingId === item.id;

            return (
              <tr 
                key={item.id} 
                className={isEditing ? "bg-purple-50/50" : "hover:bg-gray-50 transition-colors"}
              >
                {/* Name Column */}
                <td className="px-4 py-3">
                  {isEditing ? (
                    <input
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="w-full border border-purple-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#4E1A6F]"
                    />
                  ) : (
                    <span className="font-medium text-gray-900">{item.name}</span>
                  )}
                </td>

                {/* Link Column */}
                <td className="px-4 py-3">
                  {isEditing ? (
                    <input
                      name="link"
                      value={editData.link}
                      onChange={handleInputChange}
                      className="w-full border border-purple-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#4E1A6F]"
                    />
                  ) : (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#4E1A6F] hover:underline flex items-center gap-1"
                    >
                      View Video <ExternalLink size={14} />
                    </a>
                  )}
                </td>

                {/* Date Column */}
                <td className="px-4 py-3 text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>

                {/* Actions Column */}
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end space-x-1">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          title="Save Changes"
                          className="p-1.5 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          title="Cancel"
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(item)}
                          title="Edit Video"
                          className="p-1.5 text-[#4E1A6F] hover:bg-purple-100 rounded-full transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          title="Delete Video"
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <Trash2 size={18} />
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

export default TutorialVideoTable;