import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';

const AdminForm = ({ onSubmit, loading, roles }) => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password_hash: '',
    role_id: '',
  });

  const [errors, setErrors] = useState({});

  // Set default role_id once roles are loaded
  useEffect(() => {
    if (roles.length > 0 && !formData.role_id) {
      setFormData(prev => ({ ...prev, role_id: roles[0].role_id }));
    }
  }, [roles]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email format';
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.password_hash.trim()) newErrors.password_hash = 'Password is required';
    if (formData.password_hash.length < 6) newErrors.password_hash = 'Password must be at least 6 characters';
    if (!formData.role_id) newErrors.role_id = 'Please select a role';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // AdminForm.jsx

const handleSubmit = (e) => {
  e.preventDefault();
  if (validateForm() && !loading) { // Prevent clicking while loading
    onSubmit(formData);
    
    // Clear the password field for security after submission
    setFormData(prev => ({
      ...prev,
      email: '',
      full_name: '',
      password_hash: '',
    }));
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
    <form onSubmit={handleSubmit} className="bg-white rounded-xl  border border-gray-100 overflow-hidden mb-6">
      {/* Header with Vibrant Purple-Pink Gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Add New Administrator</h2>
        <p className="text-purple-100 text-sm">Create credentials for a new staff member</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all ${
                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="admin@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all ${
                errors.full_name ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="John Doe"
            />
            {errors.full_name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.full_name}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password_hash"
              value={formData.password_hash}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all ${
                errors.password_hash ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="••••••••"
            />
            {errors.password_hash && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password_hash}</p>}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">System Role</label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all appearance-none bg-no-repeat bg-right"
              style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundSize: '1.5em', backgroundPosition: 'right 0.5rem center' }}
            >
              <option value="" disabled>Select Role</option>
              {roles.length === 0 ? (
                <option value="">Loading roles...</option>
              ) : (
                roles.map(r => (
                  <option key={r.role_id} value={r.role_id}>
                    {r.role_name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg shadow-lg hover:shadow-orange-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <PlusIcon className="w-5 h-5" />
                <span>Add Admin</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AdminForm;