import React, { useState, useEffect } from 'react';
import usePartnerStore from '../stores/partnerStore';
import { partnerAPI } from '../services/homeApi';
import MainLayout from '../layouts/MainLayout';
import PartnerForm from '../components/PartnerForm';
import EditableUserTable from '../components/EditableUserTable';

const Partners = () => {
  const { partners, loading, setPartners, setLoading, setError, error } = usePartnerStore();
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const data = await partnerAPI.getAll();
      setPartners(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPartner = async (formData) => {
    setFormLoading(true);
    try {
      await partnerAPI.create(formData);
      fetchPartners();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditPartner = async (id, formData) => {
    setFormLoading(true);
    try {
      await partnerAPI.update(id, formData);
      fetchPartners();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePartner = async (id) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await partnerAPI.delete(id);
        fetchPartners();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const columns = [
    { key: 'partner_id', label: 'ID', editable: false },
    { key: 'partner_name', label: 'Partner Name', type: 'text' },
    { key: 'partner_code', label: 'Partner Code', type: 'text' },
    { key: 'created_at', label: 'Created', editable: false },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partners Management</h1>
          <p className="text-gray-600 mt-2">Manage trading partners</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}

        <PartnerForm onSubmit={handleAddPartner} loading={formLoading} />

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Partners List
            </h2>
            <p className="text-sm text-gray-600">Click edit to modify partner details</p>
          </div>
          <EditableUserTable
            columns={columns}
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
