import React, { useState} from 'react';
import Button from './Button';
import { PlusIcon } from '@heroicons/react/24/solid';
// import { partnerAPI } from '../services/homeApi';
import { validatePassword, PASSWORD_HINT } from '../utils/passwordPolicy';

const UserForm = ({ onSubmit, loading, partners = [] }) => {

  const initialFormState = {
    email: '',
    full_name: '',
    password: '',
    subscription_type: 'free',
    subscription_expires_at: '',
    partner_id: '',
    partner_code: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';

    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else {
      const pwError = validatePassword(formData.password);
      if (pwError) newErrors.password = pwError;
    }

    if (['monthly', 'yearly'].includes(formData.subscription_type) && !formData.subscription_expires_at) {
      newErrors.subscription_expires_at = 'Expiration date is required';
    }

    if (formData.subscription_type === 'partner') {
      if (!formData.partner_id) newErrors.partner_id = 'Partner is required';
      if (!formData.partner_code.trim()) newErrors.partner_code = 'Partner code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      partner_id: formData.partner_id || null,
      partner_code: formData.partner_code || null,
      subscription_expires_at: formData.subscription_expires_at || null,
    };

    onSubmit(submitData);
    setFormData(initialFormState);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-6">Add New User</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Email */}
        <div>
          <label className="block text-sm mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm mb-1">Full Name *</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.full_name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.full_name && <p className="text-xs text-red-500">{errors.full_name}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm mb-1">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password
            ? <p className="text-xs text-red-500">{errors.password}</p>
            : <p className="text-xs text-gray-400 mt-0.5">{PASSWORD_HINT}</p>
          }
        </div>

        {/* Subscription Type */}
        <div>
          <label className="block text-sm mb-1">Subscription</label>
          <select
            name="subscription_type"
            value={formData.subscription_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="free">Free</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="partner">Partner</option>
          </select>
        </div>

        {/* Expiration */}
        {['monthly', 'yearly'].includes(formData.subscription_type) && (
          <div>
            <label className="block text-sm mb-1">Expires At *</label>
            <input
              type="date"
              name="subscription_expires_at"
              value={formData.subscription_expires_at}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${errors.subscription_expires_at ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.subscription_expires_at && <p className="text-xs text-red-500">{errors.subscription_expires_at}</p>}
          </div>
        )}

        {/* Partner Select */}
        {formData.subscription_type === 'partner' && (
          <>
            <div>
              <label className="block text-sm mb-1">Partner *</label>
              <select
                name="partner_id"
                value={formData.partner_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${errors.partner_id ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Partner</option>
                {partners.map(p => (
                  <option key={p.partner_id} value={p.partner_id}>{p.partner_name}</option>
                ))}
              </select>
              {errors.partner_id && <p className="text-xs text-red-500">{errors.partner_id}</p>}
            </div>

            <div>
              <label className="block text-sm mb-1">Partner Code *</label>
              <input
                type="text"
                name="partner_code"
                value={formData.partner_code}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${errors.partner_code ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.partner_code && <p className="text-xs text-red-500">{errors.partner_code}</p>}
            </div>
          </>
        )}

      </div>

      <div className="flex justify-end mt-6">
        <Button type="submit" variant="primary" size="lg" loading={loading}>
          <PlusIcon className="w-5 h-5 mr-1" />
          Add User
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
