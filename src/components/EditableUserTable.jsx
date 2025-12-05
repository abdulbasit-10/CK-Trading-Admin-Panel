import React, { useState } from 'react';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

const EditableUserTable = ({ columns, data, onEdit, onDelete, loading, partners = [] }) => {
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
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const handleEdit = (row) => {
    setEditingId(row.user_id || row.admin_id || row.partner_id);
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
    setEditedData({
      ...editedData,
      [field]: value,
    });
  };

  const isEditing = (id) => editingId === id;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
              >
                {column.label}
              </th>
            ))}
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const rowId = row.user_id || row.admin_id || row.partner_id;
            return (
              <tr
                key={rowId}
                className={`border-b border-gray-200 transition ${
                  isEditing(rowId) ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm">
                    {isEditing(rowId) ? (
                      column.editable !== false ? (
                        column.type === 'select' ? (
                          <select
                            value={editedData[column.key] || ''}
                            onChange={(e) => handleChange(column.key, e.target.value)}
                            disabled={column.disabled && editedData.lifetime_free}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:bg-gray-100"
                          >
                            {column.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : column.type === 'checkbox' ? (
                          <input
                            type="checkbox"
                            checked={editedData[column.key] || false}
                            onChange={(e) => handleChange(column.key, e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                        ) : (
                          <input
                            type={column.type || 'text'}
                            value={editedData[column.key] || ''}
                            onChange={(e) => handleChange(column.key, e.target.value)}
                            disabled={column.disabled && editedData.lifetime_free}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:bg-gray-100"
                          />
                        )
                      ) : (
                        <span className="text-gray-500">{row[column.key]}</span>
                      )
                    ) : (
                      column.render ? column.render(row[column.key], row) : row[column.key]
                    )}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    {isEditing(rowId) ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="p-2 hover:bg-green-100 rounded-lg transition text-green-600"
                          title="Save"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600"
                          title="Cancel"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(row)}
                          className="p-2 hover:bg-yellow-100 rounded-lg transition text-yellow-600"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(rowId)}
                          className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                          title="Delete"
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

export default EditableUserTable;
