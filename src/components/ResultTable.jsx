import React from "react";

const ResultTable = ({ results=[] , onEdit, onDelete }) => {
  if (!results.length) {
    return (
      <div className="text-center text-gray-500 py-6">
        No results found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">Category</th>
            <th className="px-4 py-3 text-left font-medium">TP</th>
            <th className="px-4 py-3 text-left font-medium">SL</th>
            <th className="px-4 py-3 text-left font-medium">Wins</th>
            <th className="px-4 py-3 text-left font-medium">Created</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {results.map((item) => (
            <tr key={item.result_id}>
              <td className="px-4 py-3">{item.name}</td>
              <td className="px-4 py-3">{item.category}</td>
              <td className="px-4 py-3">{item.tp}</td>
              <td className="px-4 py-3">{item.sl}</td>
              <td className="px-4 py-3">{item.total_wins}</td>
              <td className="px-4 py-3">
                {new Date(item.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.result_id)}
                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
