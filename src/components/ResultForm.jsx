import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";

const ResultForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "crypto",
    tp: "",
    sl: "",
    total_wins: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      name: formData.name,
      category: formData.category,
      tp: Number(formData.tp),
      sl: Number(formData.sl),
      total_wins: Number(formData.total_wins),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-6 mb-6"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Create Result
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Result name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-[#4E1A6F] focus:border-transparent outline-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-[#4E1A6F] focus:border-transparent outline-none"
          >
            <option value="Select Category" disabled>
              Select Category
            </option>
            <option value="Crypto">Crypto</option>
            <option value="Forex">Forex</option>
          </select>
        </div>

        {/* TP */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            TP *
          </label>
          <input
            type="number"
            name="tp"
            value={formData.tp}
            onChange={handleChange}
            placeholder="Take Profit"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-[#4E1A6F] focus:border-transparent outline-none"
          />
        </div>

        {/* SL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SL *
          </label>
          <input
            type="number"
            name="sl"
            value={formData.sl}
            onChange={handleChange}
            placeholder="Stop Loss"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-[#4E1A6F] focus:border-transparent outline-none"
          />
        </div>

        {/* Total Wins */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Wins *
          </label>
          <input
            type="number"
            name="total_wins"
            value={formData.total_wins}
            onChange={handleChange}
            placeholder="e.g. 12"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-[#4E1A6F] focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2 bg-[#FF9201] text-white rounded-lg
             hover:bg-[#e08200] transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Result"}
        </button>

      </div>
    </form>
  );
};

export default ResultForm;
