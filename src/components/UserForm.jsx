import React, { useState, useEffect } from 'react';
import Button from './Button';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { partnerAPI } from '../services/homeApi';

const UserForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password_hash: '',
    avatar_file: null,
    avatar_preview: '',
    status: 'free',
    subscription_expires_at: '',
    partner_id: '',
    serial_number: '',
    lifetime_free: false,
    role_id: '3',
  });

  const [errors, setErrors] = useState({});
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const data = await partnerAPI.getAll();
      setPartners(data);
    } catch (error) {
      console.error('Error loading partners:', error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, avatar_file: 'Please upload a valid image file' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, avatar_file: 'Image size must be less than 5MB' });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          avatar_file: file,
          avatar_preview: reader.result,
        });
        setErrors({ ...errors, avatar_file: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setFormData({
      ...formData,
      avatar_file: null,
      avatar_preview: '',
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email format';
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.password_hash.trim()) newErrors.password_hash = 'Password is required';
    if (formData.password_hash.length < 6) newErrors.password_hash = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        email: formData.email,
        full_name: formData.full_name,
        password_hash: formData.password_hash,
        avatar_url: formData.avatar_preview || '',
        status: formData.lifetime_free ? 'premium' : formData.status,
        subscription_expires_at: formData.lifetime_free ? null : formData.subscription_expires_at,
        partner_id: formData.partner_id || null,
        serial_number: formData.serial_number,
        lifetime_free: formData.lifetime_free,
        role_id: formData.role_id,
      };
      onSubmit(submitData);
      setFormData({
        email: '',
        full_name: '',
        password_hash: '',
        avatar_file: null,
        avatar_preview: '',
        status: 'free',
        subscription_expires_at: '',
        partner_id: '',
        serial_number: '',
        lifetime_free: false,
        role_id: '3',
      });
      setErrors({});
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Add New User</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="user@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              errors.full_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
          />
          {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <input
            type="password"
            name="password_hash"
            value={formData.password_hash}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              errors.password_hash ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
          />
          {errors.password_hash && <p className="text-red-500 text-xs mt-1">{errors.password_hash}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={formData.lifetime_free}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
          >
            <option value="free">Free</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="premium">Premium</option>
            <option value="partner">Partner</option>
          </select>
        </div>

        {/* Subscription Expires At */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subscription Expires At
          </label>
          <input
            type="date"
            name="subscription_expires_at"
            value={formData.subscription_expires_at}
            onChange={handleChange}
            disabled={formData.lifetime_free}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
          />
        </div>

        {/* Partner */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Partner
          </label>
          <select
            name="partner_id"
            value={formData.partner_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">Select Partner</option>
            {partners.map(p => (
              <option key={p.partner_id} value={p.partner_id}>
                {p.partner_name}
              </option>
            ))}
          </select>
        </div>

        {/* Serial Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Serial Number
          </label>
          <input
            type="text"
            name="serial_number"
            value={formData.serial_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="SN001"
          />
        </div>

        {/* Lifetime Free */}
        <div className="flex items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="lifetime_free"
              checked={formData.lifetime_free}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Lifetime Free</span>
          </label>
        </div>
      </div>

      {/* Avatar Upload */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Avatar Image
        </label>

        {formData.avatar_preview ? (
          <div className="relative inline-block">
            <img
              src={formData.avatar_preview}
              alt="Avatar Preview"
              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatar-input"
            />
            <label
              htmlFor="avatar-input"
              className="cursor-pointer block"
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12l-3.172-3.172a4 4 0 00-5.656 0L9.172 20M21 40V28m0 0l-3 3m3-3l3 3"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Click to upload
                </span>
                {' '}or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </label>
          </div>
        )}
        {errors.avatar_file && <p className="text-red-500 text-xs mt-1">{errors.avatar_file}</p>}
      </div>

      <div className="flex justify-end mt-6">
        <Button type="submit" variant="primary" size="lg" loading={loading}>
          <PlusIcon className="w-5 h-5" />
          Add User
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
