import React, { useState } from 'react';
import Button from './Button';
import { PlusIcon } from '@heroicons/react/24/solid';

const PartnerForm = ({ onSubmit, loading }) => {
  const initialFormState = {
    partner_name: '',
    partner_code: '',
    partner_link: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.partner_name.trim()) newErrors.partner_name = 'Partner name is required';
    if (!formData.partner_code.trim()) newErrors.partner_code = 'Partner code is required';
    
    // Check if link exists
    if (!formData.partner_link.trim()) {
      newErrors.partner_link = 'Partner link is required';
    } else if (!formData.partner_link.startsWith('http')) {
      // Basic check to ensure it's a valid-ish URL
      newErrors.partner_link = 'Link must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData(initialFormState); // Clean state management
      setErrors({});
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Partner</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Partner Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Partner Name *
          </label>
          <input
            type="text"
            name="partner_name"
            value={formData.partner_name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4E1A6F] outline-none ${
              errors.partner_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Partner Name"
          />
          {errors.partner_name && <p className="text-red-500 text-xs mt-1">{errors.partner_name}</p>}
        </div>

        {/* Partner Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Partner Code *
          </label>
          <input
            type="text"
            name="partner_code"
            value={formData.partner_code}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4E1A6F] outline-none ${
              errors.partner_code ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="PARTNER001"
          />
          {errors.partner_code && <p className="text-red-500 text-xs mt-1">{errors.partner_code}</p>}
        </div>

        {/* Partner Link - Fixed error check here */}
        <div className="md:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Partner Link *
          </label>
          <input
            type="text"
            name="partner_link"
            value={formData.partner_link}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4E1A6F] outline-none ${
              errors.partner_link ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://partnerlink.com"
          />
          {errors.partner_link && <p className="text-red-500 text-xs mt-1">{errors.partner_link}</p>}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button type="submit" variant="primary" size="lg" loading={loading}>
          <PlusIcon className="w-5 h-5 mr-1" />
          Add Partner
        </Button>
      </div>
    </form>
  );
};

export default PartnerForm;