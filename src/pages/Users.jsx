import React, { useState, useEffect } from 'react';
import useUserStore from '../stores/userStore';
import { userAPI } from '../services/api';
import { partnerAPI } from '../services/homeApi';
import MainLayout from '../layouts/MainLayout';
import UserForm from '../components/UserForm';
import EditableUserTable from '../components/EditableUserTable';

const Users = () => {
  const { users, loading, setUsers, setLoading, setError, error } = useUserStore();
  const [formLoading, setFormLoading] = useState(false);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, partnersData] = await Promise.all([
        userAPI.getAll(),
        partnerAPI.getAll(),
      ]);
      setUsers(usersData);
      setPartners(partnersData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (formData) => {
    setFormLoading(true);
    try {
      await userAPI.create(formData);
      fetchData();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditUser = async (id, formData) => {
    setFormLoading(true);
    try {
      await userAPI.update(id, formData);
      fetchData();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(id);
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getPartnerName = (partnerId) => {
    if (!partnerId) return 'No Partner';
    const partner = partners.find(p => p.partner_id === partnerId);
    return partner ? partner.partner_name : 'Unknown';
  };

  const columns = [
    { key: 'user_id', label: 'ID', editable: false },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'full_name', label: 'Full Name', type: 'text' },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      disabled: true,
      options: [
        { value: 'free', label: 'Free' },
        { value: 'pending_verification', label: 'Pending Verification' },
        { value: 'premium', label: 'Premium' },
        { value: 'partner', label: 'Partner' },
      ],
      render: (status) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === 'premium'
              ? 'bg-green-100 text-green-800'
              : status === 'pending_verification'
              ? 'bg-yellow-100 text-yellow-800'
              : status === 'partner'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {status}
        </span>
      ),
    },
    { key: 'subscription_expires_at', label: 'Subscription Expires', type: 'date', disabled: true },
    {
      key: 'partner_id',
      label: 'Partner',
      type: 'select',
      options: [
        { value: '', label: 'No Partner' },
        ...partners.map(p => ({ value: p.partner_id, label: p.partner_name })),
      ],
      render: (partnerId) => (
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          {getPartnerName(partnerId)}
        </span>
      ),
    },
    { key: 'serial_number', label: 'Serial #', type: 'text' },
    {
      key: 'lifetime_free',
      label: 'Lifetime Free',
      type: 'checkbox',
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            value ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value ? 'Yes' : 'No'}
        </span>
      ),
    },
    { key: 'created_at', label: 'Created', editable: false },
    { key: 'last_login_at', label: 'Last Login', editable: false },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">Manage all registered users and their subscriptions</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}

        <UserForm onSubmit={handleAddUser} loading={formLoading} />

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Users List</h2>
            <p className="text-sm text-gray-600">Click edit to modify user details</p>
          </div>
          <EditableUserTable
            columns={columns}
            data={users}
            loading={loading}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            partners={partners}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Users;
