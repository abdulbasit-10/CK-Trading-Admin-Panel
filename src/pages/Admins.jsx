import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast'; // or 'react-toastify' depending on your setup
import useAdminStore from '../stores/adminStore';
import { adminAPI } from '../api/adminApi';
import MainLayout from '../layouts/MainLayout';
import AdminForm from '../components/AdminForm';
import AdminsTable from '../components/AdminTable';

const Admins = () => {
  const { admins, loading, setAdmins, setLoading, setError } = useAdminStore();
  const [formLoading, setFormLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adminsData, rolesData] = await Promise.all([
        adminAPI.getAdmins(),
        adminAPI.getRole(),
      ]);
      
      // Handle the nested 'admins' key from your backend response
      setAdmins(adminsData.admins || []);
      setRoles(rolesData.roles || []);
      setError(null);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch data";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (formData) => {
  setFormLoading(true);
  try {
    // 1. Prepare the payload exactly as the backend expects it
    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password_hash, // RENAME: backend uses 'password'
      role_id: formData.role_id
    };

    // 2. Call the API
    const response = await adminAPI.createAdmin(payload);
    
    // 3. Handle Success
    if (response.success) {
      toast.success(response.message || "Admin created!");
      fetchData(); // Refresh list
      setError(null);
    }
  } catch (err) {
    // 4. Detailed Error Reporting
    // This looks for the specific message from your backend (e.g., "Email already exists")
    const errorMessage = err.response?.data?.message || "Error creating admin";
    setError(errorMessage);
    toast.error(errorMessage);
    console.error("Backend Error:", err.response?.data);
  } finally {
    setFormLoading(false);
  }
};

  const handleEditAdmin = async (id, formData) => {
    try {
      // Create a promise for the toast loading state if you want
      await adminAPI.update(id, formData);
      toast.success("Admin updated successfully");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await adminAPI.deleteAdmin(id);
        toast.success("Admin removed from system");
        fetchData();
      } catch (err) {
        // Surface the exact backend message (self-delete, last super_admin, etc.)
        const msg = err.response?.data?.message || "Could not delete admin";
        toast.error(msg);
      }
    }
  };

  // Define table columns (same as previous, ensure key names match your backend SELECT query)
  const columns = [
    { 
      key: 'avatar_url', 
      label: '', 
      editable: false,
      render: (url) => (
        <img src={url || 'https://via.placeholder.com/40'} className="w-8 h-8 rounded-full" alt="avatar" />
      )
    },
    { key: 'full_name', label: 'Full Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { 
      key: 'role_name', 
      label: 'Role', 
      editable: false, 
      render: (val) => (
        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
          val === 'super_admin' ? 'bg-linear-to-r from-purple-500 to-pink-500' : 'bg-linear-to-r from-blue-500 to-cyan-500'
        }`}>
          {val === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN'}
        </span>
      )
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6 pb-12">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Admins Management</h1>
          <p className="text-gray-600">Securely manage your team and access levels</p>
        </header>

        {/* Form Section */}
        <AdminForm onSubmit={handleAddAdmin} loading={formLoading} roles={roles} />

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
           <AdminsTable 
              data={admins} 
              columns={columns} 
              loading={loading}
              onEdit={handleEditAdmin}
              onDelete={handleDeleteAdmin}
              rowKey="user_id"
            />
        </div>
      </div>
    </MainLayout>
  );
};

export default Admins;