import React, { useState, useEffect } from 'react';
import { userAPI } from '../api/userApi';
import MainLayout from '../layouts/MainLayout';
import UserForm from '../components/UserForm';
import EditableUserTable from '../components/EditableUserTable';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [partners, setPartners] = useState([]);

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [page]);

 const fetchData = async () => {
  setLoading(true);
  try {
    const [usersRes, partnersRes] = await Promise.all([
      userAPI.getAll(page, limit),
      userAPI.getPartners(),
    ]);

    // ✅ Axios response handling
    setUsers(usersRes.data.users || []);
    setTotalPages(usersRes.data.totalPages || 1);

    setPartners(partnersRes.data.data || []);
    setError(null);
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};


  const handleAddUser = async (data) => {
    try {
      setFormLoading(true);
      await userAPI.addUser(data);
      toast.success('User created successfully');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditUser = async (id, formData) => {
    try {
      setFormLoading(true);
      await userAPI.update(id, formData);
      toast.success('User updated');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await userAPI.deleteUser(id);
      toast.success('User deleted');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
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
      key: 'partner_id',
      label: 'Partner',
      type: 'select',
      options: [
        { value: '', label: 'No Partner' },
        ...partners.map(p => ({
          value: p.partner_id,
          label: p.partner_name,
        })),
      ],
      render: (partnerId) => (
        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800">
          {getPartnerName(partnerId)}
        </span>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Users Management</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded">
            {error}
          </div>
        )}

        <UserForm
          onSubmit={handleAddUser}
          loading={formLoading}
          partners={partners}
        />

        <EditableUserTable
          columns={columns}
          data={users}
          loading={loading}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>Page {page} of {totalPages}</span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Users;
