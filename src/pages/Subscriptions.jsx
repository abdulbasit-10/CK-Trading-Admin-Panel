import React, { useState, useEffect } from 'react';
import useSubscriptionStore from '../stores/subscriptionStore';
import { subscriptionAPI, userAPI } from '../services/api';
import MainLayout from '../layouts/MainLayout';
import EditableUserTable from '../components/EditableUserTable';

const Subscriptions = () => {
  const { subscriptions, loading, setSubscriptions, setLoading, setError, error } = useSubscriptionStore();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subscriptionsData, usersData] = await Promise.all([
        subscriptionAPI.getAll(),
        userAPI.getAll(),
      ]);
      setSubscriptions(subscriptionsData);
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubscription = async (id, formData) => {
    try {
      await subscriptionAPI.update(id, formData);
      fetchData();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSubscription = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await subscriptionAPI.delete(id);
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getUserEmail = (userId) => {
    const user = users.find(u => u.user_id === userId);
    return user ? user.email : 'Unknown';
  };

  const columns = [
    { key: 'subscription_id', label: 'ID', editable: false },
    {
      key: 'user_id',
      label: 'User Email',
      editable: false,
      render: (userId) => <span>{getUserEmail(userId)}</span>,
    },
    {
      key: 'plan_type',
      label: 'Plan Type',
      type: 'select',
      options: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'annually', label: 'Annually' },
        { value: 'lifetime_free', label: 'Lifetime Free' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'active', label: 'Active' },
        { value: 'expired', label: 'Expired' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
      render: (status) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === 'active'
              ? 'bg-green-100 text-green-800'
              : status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : status === 'expired'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {status}
        </span>
      ),
    },
    { key: 'start_date', label: 'Start Date', type: 'date' },
    { key: 'end_date', label: 'End Date', type: 'date' },
    { key: 'created_at', label: 'Created', editable: false },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions Management</h1>
          <p className="text-gray-600 mt-2">Manage user subscriptions and plans</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Subscriptions List</h2>
            <p className="text-sm text-gray-600">Click edit to modify subscription details</p>
          </div>
          <EditableUserTable
            columns={columns}
            data={subscriptions}
            loading={loading}
            onEdit={handleEditSubscription}
            onDelete={handleDeleteSubscription}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Subscriptions;
