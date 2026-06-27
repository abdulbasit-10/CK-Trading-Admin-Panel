import React, { useState } from "react";
import { VideoCameraIcon, LinkIcon } from "@heroicons/react/24/solid";

const TutorialVideoForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Send the data to the parent component/API
    onSubmit({
      name: formData.name,
      link: formData.link,
    });

    // 2. Clear the form fields after submission
    setFormData({
      name: "",
      link: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-6 mb-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <VideoCameraIcon className="h-6 w-6 text-[#4E1A6F]" />
        <h2 className="text-xl font-bold text-gray-900">
          Create Tutorial Video
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Video Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video Title *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Technical Analysis 101"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-[#4E1A6F] focus:border-transparent outline-none"
          />
        </div>

        {/* Video Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video Link *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-[#4E1A6F] focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2 bg-[#FF9201] text-white rounded-lg
                     hover:bg-[#e08200] transition disabled:opacity-50 font-medium"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            "Create Video"
          )}
        </button>
      </div>
    </form>
  );
};

export default TutorialVideoForm;