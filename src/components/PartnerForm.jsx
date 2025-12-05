import React, { useState } from 'react';
import Button from './Button';
import { PlusIcon } from '@heroicons/react/24/solid';

const PartnerForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    partner_name: '',
    partner_code: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.partner_name.trim()) newErrors.partner_name = 'Partner name is required';
    if (!formData.partner_code.trim()) newErrors.partner_code = 'Partner code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        partner_name: '',
        partner_code: '',
      });
      setErrors({});
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
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
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              errors.partner_code ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="PARTNER001"
          />
          {errors.partner_code && <p className="text-red-500 text-xs mt-1">{errors.partner_code}</p>}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button type="submit" variant="primary" size="lg" loading={loading}>
          <PlusIcon className="w-5 h-5" />
          Add Partner
        </Button>
      </div>
    </form>
  );
};

export default PartnerForm;
