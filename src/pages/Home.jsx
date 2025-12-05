import React, { useState, useEffect } from 'react';
import useHomeStore from '../stores/homeStore';
import { announcementAPI, pairAnalysisAPI } from '../services/homeApi';
import MainLayout from '../layouts/MainLayout';
import AnnouncementForm from '../components/AnnouncementForm';
import AnnouncementTable from '../components/AnnouncementTable';
import AnalysisForm from '../components/AnalysisForm';
import AnalysisTable from '../components/AnalysisTable';

const Home = () => {
  const {
    announcements,
    pairAnalysis,
    loading,
    error,
    setAnnouncements,
    setPairAnalysis,
    setLoading,
    setError,
  } = useHomeStore();

  const [activeTab, setActiveTab] = useState('announcements');
  const [categoryFilter, setCategoryFilter] = useState('Forex');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [announcementsData, analysisData] = await Promise.all([
        announcementAPI.getAll(),
        pairAnalysisAPI.getAll(),
      ]);
      setAnnouncements(announcementsData);
      setPairAnalysis(analysisData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnouncement = async (formData) => {
    setFormLoading(true);
    try {
      await announcementAPI.create(formData);
      fetchData();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateAnnouncement = async (id, formData) => {
    setFormLoading(true);
    try {
      await announcementAPI.update(id, formData);
      fetchData();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await announcementAPI.delete(id);
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleAddAnalysis = async (formData) => {
    setFormLoading(true);
    try {
      await pairAnalysisAPI.create(formData);
      fetchData();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAnalysis = async (id) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      try {
        await pairAnalysisAPI.delete(id);
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const filteredAnalysis = pairAnalysis.filter(
    (a) => a.category === categoryFilter
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Home Management</h1>
          <p className="text-gray-600 mt-2">
            Manage announcements and pair analysis for mobile app home page
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 font-medium transition border-b-2 ${
              activeTab === 'announcements'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-2 font-medium transition border-b-2 ${
              activeTab === 'analysis'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Pair Analysis
          </button>
        </div>

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <AnnouncementForm onSubmit={handleAddAnnouncement} loading={formLoading} />

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                All Announcements
              </h2>
              <AnnouncementTable
                data={announcements}
                loading={loading}
                onEdit={handleUpdateAnnouncement}
                onDelete={handleDeleteAnnouncement}
              />
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <AnalysisForm onSubmit={handleAddAnalysis} loading={formLoading} />

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Pair Analysis
                </h2>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Forex">Forex</option>
                  <option value="Crypto">Crypto</option>
                </select>
              </div>
              <AnalysisTable
                data={filteredAnalysis}
                loading={loading}
                onDelete={handleDeleteAnalysis}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
