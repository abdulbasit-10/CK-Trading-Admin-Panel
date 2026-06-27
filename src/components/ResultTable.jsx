import React, { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";

const ResultTable = ({ results = [], onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  if (!results.length) {
    return <div className="text-center text-gray-500 py-6">No results found</div>;
  }

  const startEdit = (item) => {
    setEditingId(item.result_id);
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
          {results.map((item) => {
            const isEditing = editingId === item.result_id;

            return (
              <tr key={item.result_id} className={isEditing ? "bg-purple-50/50" : "hover:bg-gray-50 transition-colors"}>
                {/* Name - Now Editable */}
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

                <td className="px-4 py-3">
                  {isEditing ? (
                    <select
                      name="category"
                      value={editData.category}
                      onChange={handleInputChange}
                      className="w-full border border-purple-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#4E1A6F]"
                    >
                      <option value="Forex">Forex</option>
                      <option value="Crypto">Crypto</option>
                    </select>
                  ) : (
                    item.category
                  )}
                </td>


                <td className="px-4 py-3">
                  {isEditing ? (
                    <input
                      name="tp"
                      type="number"
                      value={editData.tp}
                      onChange={handleInputChange}
                      className="w-20 border border-purple-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#4E1A6F]"
                    />
                  ) : (item.tp)}
                </td>

                <td className="px-4 py-3">
                  {isEditing ? (
                    <input
                      name="sl"
                      type="number"
                      value={editData.sl}
                      onChange={handleInputChange}
                      className="w-20 border border-purple-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#4E1A6F]"
                    />
                  ) : (item.sl)}
                </td>

                <td className="px-4 py-3">
                  {isEditing ? (
                    <input
                      name="total_wins"
                      type="number"
                      value={editData.total_wins}
                      onChange={handleInputChange}
                      className="w-20 border border-purple-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#4E1A6F]"
                    />
                  ) : (item.total_wins)}
                </td>

                <td className="px-4 py-3 text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>

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
                          title="Edit Row"
                          className="p-1.5 text-[#4E1A6F] hover:bg-purple-100 rounded-full transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(item.result_id)}
                          title="Delete Row"
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

export default ResultTable;