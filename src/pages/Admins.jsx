import React, { useState, useEffect } from 'react';
import useAdminStore from '../stores/adminStore';
import { adminAPI, roleAPI } from '../services/api';
import MainLayout from '../layouts/MainLayout';
import AdminForm from '../components/AdminForm';
import EditableUserTable from '../components/EditableUserTable';

const Admins = () => {
  const { admins, loading, setAdmins, setLoading, setError, error } = useAdminStore();
  const [formLoading, setFormLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adminsData, rolesData] = await Promise.all([
        adminAPI.getAll(),
        roleAPI.getAll(),
      ]);
      setAdmins(adminsData);
      setRoles(rolesData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (formData) => {
    setFormLoading(true);
    try {
      await adminAPI.create(formData);
      fetchData();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditAdmin = async (id, formData) => {
    setFormLoading(true);
    try {
      await adminAPI.update(id, formData);
      fetchData();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await adminAPI.delete(id);
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.role_id === roleId);
    if (!role) return 'Unknown';
    return role.role_name === 'super_admin' ? 'Super Admin' : 'Admin';
  };

  const columns = [
    { key: 'admin_id', label: 'ID', editable: false },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'full_name', label: 'Full Name', type: 'text' },
    {
      key: 'role_id',
      label: 'Role',
      type: 'select',
      options: roles
        .filter(r => r.role_name !== 'user')
        .map(r => ({ 
          value: r.role_id, 
          label: r.role_name === 'super_admin' ? 'Super Admin' : 'Admin' 
        })),
      render: (roleId) => (
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {getRoleName(roleId)}
        </span>
      ),
    },
    { key: 'created_at', label: 'Created', editable: false },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admins Management</h1>
          <p className="text-gray-600 mt-2">Manage admin users and their permissions</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}

        <AdminForm onSubmit={handleAddAdmin} loading={formLoading} />

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Admins List</h2>
            <p className="text-sm text-gray-600">Click edit to modify admin details</p>
          </div>
          <EditableUserTable
            columns={columns}
            data={admins}
            loading={loading}
            onEdit={handleEditAdmin}
            onDelete={handleDeleteAdmin}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Admins;
