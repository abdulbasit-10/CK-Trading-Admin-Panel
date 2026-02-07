import React, { useState, useEffect, useCallback } from "react";
import { announcementAPI } from "../../api/homeApi";
import AnnouncementForm from "../AnnouncementForm";
import AnnouncementTable from "../AnnouncementTable";
import toast from "react-hot-toast";

const PAGE_LIMIT = 10;

const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  /* =======================
      FETCH ANNOUNCEMENTS 
  ======================== */
  const fetchAnnouncements = useCallback(async (currentPage) => {
    setLoading(true);
    try {
      const res = await announcementAPI.getAll(currentPage);
      // Ensure we are setting the data correctly based on your API structure
      setAnnouncements(res.announcements || []);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.total || 0);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Unable to load announcements.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for page changes
  useEffect(() => {
    fetchAnnouncements(page);
  }, [page, fetchAnnouncements]);

  /* =======================
      ADD ANNOUNCEMENT
  ======================== */
  const handleAdd = async (formData) => {
    setFormLoading(true);
    try {
      await announcementAPI.create(formData);
      toast.success("Announcement created successfully");

      // Check if we are already on page 1
      if (page === 1) {
        // Refresh manually if we're already on the first page
        await fetchAnnouncements(1);
      } else {
        // This will trigger the useEffect to fetch page 1
        setPage(1);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to create announcement"
      );
    } finally {
      setFormLoading(false);
    }
  };

  /* =======================
      EDIT ANNOUNCEMENT
  ======================== */
  const handleEdit = async (id, updatedData) => {
    try {
      await announcementAPI.update(id, updatedData);
      toast.success("Announcement updated successfully");
      await fetchAnnouncements(page);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update announcement"
      );
    }
  };

  /* =======================
      DELETE ANNOUNCEMENT
  ======================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;

    const toastId = toast.loading("Deleting announcement...");
    try {
      await announcementAPI.delete(id);
      toast.success("Announcement deleted successfully", { id: toastId });

      // If we delete the last item on a page, go back a page
      if (announcements.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchAnnouncements(page);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to delete announcement",
        { id: toastId }
      );
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      <AnnouncementForm onSubmit={handleAdd} loading={formLoading} />

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Live Announcements
          </h2>
          <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            Total: {totalItems}
          </span>
        </div>

        <AnnouncementTable
          data={announcements}
          loading={loading}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
          <div className="text-sm text-gray-700">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </div>

          <div className="flex gap-2">
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-white transition"
            >
              Previous
            </button>

            <button
              disabled={page === totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-white transition"
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