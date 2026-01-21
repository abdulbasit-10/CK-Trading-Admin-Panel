import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import TutorialVideoForm from "@/components/ToturialsVideoForm";
import TutorialVideoTable from "@/components/TutorialVideoTable";
import { videoAPI } from "../api/videoApi"; // You'll need to create this API helper
import toast from "react-hot-toast";

const TutorialVideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetching from your Node.js backend
      const res = await videoAPI.getAll({
        page,
        limit,
      });

      console.log(res);
      
      // Adjust these keys based on your actual API response structure
      setVideos(res); 
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      toast.error("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [page]);

  const handleCreateVideo = async (data) => {
    try {
      setLoading(true);
      await videoAPI.create(data);
      toast.success("Video added successfully");
      setPage(1); // Go back to first page to see new entry
      fetchVideos();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add video";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      await videoAPI.delete(id);
      toast.success("Video deleted");
      fetchVideos();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      setLoading(true);
      await videoAPI.update(id, updatedData);
      toast.success("Video updated successfully");
      fetchVideos();
    } catch (err) {
      toast.error("Failed to update video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tutorial Videos</h1>
          <p className="text-gray-600">Manage educational content and trade walkthroughs</p>
        </div>

        {error && (
          <div className="bg-red-50 p-3 rounded text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {/* The Form we created earlier */}
        <TutorialVideoForm onSubmit={handleCreateVideo} loading={loading} />

        {/* The Table we created earlier */}
        <TutorialVideoTable
          videos={videos}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />

        {/* Pagination Logic */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg border">
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-1.5 border rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>

            <button
              disabled={page === totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-1.5 border rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TutorialVideoPage;