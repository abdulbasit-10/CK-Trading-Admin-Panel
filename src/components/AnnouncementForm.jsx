import React, { useState } from "react";
import Button from "./Button";
import { PlusIcon } from "@heroicons/react/24/solid";
import apiClient from "../api/client";
import { toast } from "react-hot-toast";

const AnnouncementForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    link: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.message,
        is_active: formData.is_active,
      };

      // 🔥 Only add link if it exists
      if (formData.link.trim()) {
        payload.link = formData.link.trim();
      }

      await apiClient.post("/announcements", payload);

      toast.success("Announcement created successfully");

      setFormData({
        title: "",
        message: "",
        link: "",
        is_active: true,
      });
      setErrors({});
    } catch (error) {
      console.error("Create announcement failed:", error);
      toast.error("Failed to create announcement");
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Create Announcement
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg ${errors.title ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Announcement title"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className={`w-full px-4 py-2 border rounded-lg resize-none ${errors.message ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Announcement message"
          />
          {errors.message && (
            <p className="text-red-500 text-xs mt-1">{errors.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link
          </label>
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Announcement link (optional)"
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Active
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button type="submit" variant="primary" size="lg" loading={loading}>
          <PlusIcon className="w-5 h-5" />
          Create Announcement
        </Button>
      </div>
    </form>
  );
};

export default AnnouncementForm;
