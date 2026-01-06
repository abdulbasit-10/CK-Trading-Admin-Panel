import React, { useState, useEffect, useCallback } from 'react';
import { announcementAPI } from '../../api/homeApi';
import AnnouncementForm from '../AnnouncementForm';
import AnnouncementTable from '../AnnouncementTable';

const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchAnnouncements = useCallback(async (currentPage) => {
    setLoading(true);
    try {
      const res = await announcementAPI.getAll(currentPage);
      
      // Matches your API structure: { announcements: [], total: X, totalPages: Y }
      setAnnouncements(res.announcements || []);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.total || 0);
      setError(null);
    } catch (err) {
      setError("Unable to connect to database. Check if your backend/DB is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements(page);
  }, [page, fetchAnnouncements]);

  // Handle adding new announcement
  const handleAdd = async (formData) => {
    setFormLoading(true);
    try {
      await announcementAPI.create(formData);
      setPage(1); // Jump to first page to see the newest announcement
      fetchAnnouncements(1);
    } catch (err) {
      alert("Error creating announcement: " + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await announcementAPI.delete(id);
        fetchAnnouncements(page);
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow">
          <p className="font-bold">Database Error</p>
          <p>{error}</p>
        </div>
      )}

      <AnnouncementForm onSubmit={handleAdd} loading={formLoading} />

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Live Announcements</h2>
          <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            Total: {totalItems}
          </span>
        </div>
        
        <AnnouncementTable 
          data={announcements} 
          loading={loading} 
          onDelete={handleDelete}
        />

        {/* Improved Pagination Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
          </div>
          <div className="flex space-x-2">
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage(prev => prev - 1)}
              className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={page === totalPages || loading}
              onClick={() => setPage(prev => prev + 1)}
              className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsSection;