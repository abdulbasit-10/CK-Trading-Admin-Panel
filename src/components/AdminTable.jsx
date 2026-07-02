import React, { useState } from 'react';
import { Edit2, Trash2, Check, X, Loader2 } from 'lucide-react';
import useAuth from '../auth/useAuth';

const AdminsTable = ({ data, columns, loading, onEdit, onDelete, rowKey = 'user_id' }) => {
  const { user: currentUser } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEditing = (admin) => {
    setEditingId(admin[rowKey]);
    setEditForm(admin);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleInputChange = (key, value) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (id) => {
    await onEdit(id, editForm);
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <p className="text-gray-500 font-medium">Loading administrator data...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((admin) => {
            const isEditing = editingId === admin[rowKey];

            return (
              <tr 
                key={admin[rowKey]} 
                className="group hover:bg-slate-50 transition-all duration-200 ease-in-out transform hover:scale-[1.002]"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                    {isEditing && col.editable !== false ? (
                      col.type === 'select' ? (
                        <select
                          className="w-full p-2 border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
                          value={editForm[col.key] || ''}
                          onChange={(e) => handleInputChange(col.key, e.target.value)}
                        >
                          {col.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={col.type || 'text'}
                          className="w-full p-2 border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
                          value={editForm[col.key] || ''}
                          onChange={(e) => handleInputChange(col.key, e.target.value)}
                        />
                      )
                    ) : (
                      <div className="text-sm text-gray-700">
                        {col.render ? col.render(admin[col.key], admin) : admin[col.key]}
                      </div>
                    )}
                  </td>
                ))}

                {/* Actions Column */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {isEditing ? (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleSave(admin[rowKey])}
                        className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors shadow-sm"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditing(admin)}
                        className="p-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-md transition-all active:scale-95"
                      >
                        <Edit2 size={16} />
                      </button>
                      {/* Hide delete button for the currently logged-in user's own row */}
                      {currentUser?.id !== admin[rowKey] && (
                        <button
                          onClick={() => onDelete(admin[rowKey])}
                          className="p-2 bg-linear-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-md transition-all active:scale-95"
                          title="Delete admin"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {data.length === 0 && !loading && (
        <div className="p-12 text-center text-gray-400 bg-white">
          No administrators found.
        </div>
      )}
    </div>
  );
};

export default AdminsTable;