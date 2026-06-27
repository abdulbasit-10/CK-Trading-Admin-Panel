import React, { useState } from "react";
import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const TrustWalletTable = ({ data, loading, onSave, onCreate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    pay_id: "",
    trc_20_address: "",
    bep_20_address: "",
  });
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-b-2 border-[#4E1A6F] rounded-full" />
      </div>
    );
  }

  if (!data) {
    const rows = [
      { label: "Pay ID", key: "pay_id" },
      { label: "TRC-20 Address", key: "trc_20_address" },
      { label: "BEP-20 Address", key: "bep_20_address" },
    ];

    if (!isCreating) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No trust wallet credentials configured yet.</p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 text-sm rounded bg-[#4E1A6F] text-white hover:bg-[#3d1558]"
          >
            Create Credentials
          </button>
        </div>
      );
    }

    const handleCreate = async () => {
      setSaving(true);
      try {
        await onCreate(form);
        setIsCreating(false);
        setForm({ pay_id: "", trc_20_address: "", bep_20_address: "" });
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Field</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b last:border-b-0">
                <td className="px-4 py-3 text-sm font-medium">{row.label}</td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={form[row.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [row.key]: e.target.value }))}
                    className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-[#4E1A6F] outline-none text-sm"
                    placeholder={`Enter ${row.label}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
          <button
            onClick={() => { setIsCreating(false); setForm({ pay_id: "", trc_20_address: "", bep_20_address: "" }); }}
            disabled={saving}
            className="px-4 py-2 text-sm rounded border hover:bg-gray-100 flex items-center gap-1"
          >
            <XMarkIcon className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={saving}
            className="px-4 py-2 text-sm rounded bg-[#FF9201] text-white hover:bg-[#e08200] flex items-center gap-1"
          >
            <CheckIcon className="w-4 h-4" />
            {saving ? "Saving..." : "Create"}
          </button>
        </div>
      </div>
    );
  }

  const startEdit = () => {
    setForm(data);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setForm(data);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await onSave(form);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const rows = [
    { label: "Pay ID", key: "pay_id" },
    { label: "TRC-20 Address", key: "trc_20_address" },
    { label: "BEP-20 Address", key: "bep_20_address" },
  ];

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Field
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Value
            </th>
            <th className="px-4 py-3 w-24" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b last:border-b-0">
              <td className="px-4 py-3 text-sm font-medium">
                {row.label}
              </td>
              <td className="px-4 py-3">
                {isEditing ? (
                  <input
                    type="text"
                    value={form[row.key] || ""}
                    onChange={(e) =>
                      handleChange(row.key, e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-[#4E1A6F] outline-none text-sm"
                  />
                ) : (
                  <span className="text-sm text-gray-700 break-all">
                    {data[row.key]}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                {!isEditing && row.key === "pay_id" && (
                  <button
                    onClick={startEdit}
                    className="p-2 hover:bg-yellow-100 rounded text-yellow-600"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && (
        <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
          <button
            onClick={cancelEdit}
            disabled={saving}
            className="px-4 py-2 text-sm rounded border hover:bg-gray-100 flex items-center gap-1"
          >
            <XMarkIcon className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 text-sm rounded bg-[#FF9201] text-white hover:bg-[#e08200] flex items-center gap-1"
          >
            <CheckIcon className="w-4 h-4" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TrustWalletTable;
    