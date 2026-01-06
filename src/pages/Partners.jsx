import React, { useState, useEffect } from 'react';
import usePartnerStore from '../stores/partnerStore';
import { partnerAPI } from '../api/partnerApi';
import MainLayout from '../layouts/MainLayout';
import PartnerForm from '../components/PartnerForm';
import PartnerTable from '@/components/PartnerTable';
import toast from 'react-hot-toast';

const Partners = () => {
  const {  loading, setLoading, setError, error } = usePartnerStore();
  const [formLoading, setFormLoading] = useState(false);
  const [partners, setPartners] = useState([]);


  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const data = await partnerAPI.getPartners();
      setPartners(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load partners");
    } finally {
      setLoading(false);
    }
  };

  // CRUD Handlers
const handleAddPartner = async (formData) => {
  setFormLoading(true);
  try {
    await partnerAPI.create(formData);
    toast.success("Partner created!");
    fetchPartners();
  } catch (err) {
    // This catches the 409 error from your API
    const message = err.response?.data?.message || err.message;
    toast.error(message); 
  } finally {
    setFormLoading(false);
  }
};
// Inside Partners.js
const handleEditPartner = async (id, formData) => {
  try {
    // Return the promise so the Table can 'await' it
    return await partnerAPI.update(id, formData);
  } catch (err) {
    toast.error(err.message);
    throw err; // Re-throw so finally block in table triggers correctly
  } finally {
    fetchPartners(); // Refresh data
  }
};

// Frontend: Partners.js
const handleDeletePartner = async (id) => {
  if (window.confirm('Are you sure you want to delete this partner?')) {
    try {
      // We 'await' the API call so the table's loading state works
      const response = await partnerAPI.delete(id);
      
      toast.success("Partner deleted successfully");
      fetchPartners(); // Refresh the list
    } catch (err) {
      // 1. Extract the specific message sent by your backend
      const serverMessage = err.response?.data?.message;
      const fallbackMessage = "An error occurred while deleting the partner";
      
      // 2. Show the specific "Cannot delete: Users attached" message to the user
      toast.error(serverMessage || fallbackMessage, {
        duration: 5000, // Keep it visible longer so they can read the instruction
        style: {
          border: '1px solid #fee2e2',
          padding: '16px',
          color: '#991b1b',
        },
      });
      
      // Re-throw so the Table's 'finally' block clears the loading state
      throw err; 
    }
  }
};



  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Partners Management</h1>
            <p className="text-gray-600 mt-2">Manage trading partners and integration links</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}

        {/* Form for adding new partners */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Add New Partner</h2>
          <PartnerForm onSubmit={handleAddPartner} loading={formLoading} />
        </div>

        {/* Table for listing and inline editing */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Partners List</h2>
          </div>
          <PartnerTable
            data={partners}
            loading={loading}
            onEdit={handleEditPartner}
            onDelete={handleDeletePartner}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Partners;