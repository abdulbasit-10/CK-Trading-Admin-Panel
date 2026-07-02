import React from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';
import useAuth from '../auth/useAuth';

const EditableUserTable = ({ columns, data, onDelete, loading }) => {
  const { user: currentUser } = useAuth();
  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4E1A6F]"></div>
      </div>
    );
  }

  // Empty State
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

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
            {onDelete && (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const rowId = row.user_id || row.admin_id || row.partner_id;
            return (
              <tr
                key={rowId}
                className="border-b border-gray-200 transition hover:bg-gray-50"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-gray-800">
                    {/* Support for custom render functions in column definitions */}
                    {column.render 
                      ? column.render(row[column.key], row) 
                      : row[column.key]
                    }
                  </td>
                ))}
                
                {onDelete && (
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {/* Admins cannot delete their own account from this table */}
                      {currentUser?.id !== rowId && (
                        <button
                          onClick={() => onDelete(rowId)}
                          className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EditableUserTable;