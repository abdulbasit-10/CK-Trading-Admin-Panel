import React, { useState } from 'react';

const RegisterPage = ({ onSuccessfulRegistration, isAdminCreatingUser = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  // Only for admin creation form:
  const [targetRole, setTargetRole] = useState(isAdminCreatingUser ? 'admin' : 'user'); 
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const payload = { 
        name, 
        email, 
        password,
        ...(isAdminCreatingUser && { role: targetRole })
    };
    
    const apiEndpoint = isAdminCreatingUser 
        ? '/api/v1/admin/user-management/create' 
        : '/api/v1/auth/register';             

    try {
      // --- API CALL PLACEHOLDER ---
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Only include the token if an existing admin is creating the user
          ...(isAdminCreatingUser && { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` })
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed.');
      }

      setSuccess(`User ${email} successfully registered!`);
      setName('');
      setEmail('');
      setPassword('');
      
      onSuccessfulRegistration();

    } catch (err) {
      setError(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isAdminCreatingUser ? 'Register New Staff/Admin' : 'Initial Admin Registration'}
        </h2>
        <form onSubmit={handleRegister} className="space-y-6">
          
          {/* Messages */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{success}</span>
            </div>
          )}
          
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            />
          </div>
          
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            />
          </div>
          
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            />
          </div>

          {/* Role Selector (Admin-Creation Scenario Only) */}
          {isAdminCreatingUser && (
              <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Assign Role</label>
                  <select
                      id="role"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      required
                      disabled={loading}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                  >
                      <option value="admin">Admin</option>
                      <option value="user">Standard User (Staff)</option>
                      <option value="super_admin">Super Admin</option> 
                  </select>
              </div>
          )}
          
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;