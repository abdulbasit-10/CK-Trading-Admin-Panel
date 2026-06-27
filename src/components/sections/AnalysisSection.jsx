import React, { useState, useEffect, useCallback } from 'react';
import useHomeStore from '../../stores/homeStore';
import { pairAnalysisAPI } from '../../api/homeApi'; // Corrected import name
import AnalysisForm from '../AnalysisForm';
import AnalysisTable from '../AnalysisTable';
import toast from 'react-hot-toast';


const AnalysisSection = () => {
  const { pairAnalysis, loading, setPairAnalysis, setLoading, setError } = useHomeStore();
  const [categoryFilter, setCategoryFilter] = useState('Forex');
  const [formLoading, setFormLoading] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);


  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Added missing state
  const [totalItems, setTotalItems] = useState(0); // Added missing state

  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      const result = await pairAnalysisAPI.getByCategory(categoryFilter, page);


      console.log("Page: ", result.total_pages)
      console.log("Fetch Result:", result.analysis_pairs);

      if (result && result.analysis_pairs) {
        setPairAnalysis(result.analysis_pairs); // This is your array
        setTotalPages(result.total_pages || 1);
        setTotalItems(result.total_items || 0);
      } else {
        setPairAnalysis([]); // Fallback to empty array
      }

      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
      setPairAnalysis([]); // Essential: prevent 'undefined' on error
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, page, setPairAnalysis, setLoading, setError]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setPage(1); // Reset to first page on category change
  };

  const handleAdd = async (formData) => {
    setFormLoading(true);
    try {
      await pairAnalysisAPI.create(formData);
      setPage(1);
      await fetchAnalysis();
      return true;
    } catch (err) {
      setError(err.message || "Failed to create analysis");
      return false;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) return;

    const toastId = toast.loading('Deleting analysis...');

    try {
      await pairAnalysisAPI.delete(id);

      toast.success('Analysis deleted successfully', {
        id: toastId,
      });

      // Handle pagination edge case
      if (pairAnalysis.length === 1 && page > 1) {
        setPage(prev => prev - 1);
      } else {
        await fetchAnalysis();
      }

    } catch (err) {
      toast.error(err.message || 'Failed to delete analysis', {
        id: toastId,
      });
      setError(err.message);
    }
  };

  const handleDeleteAll = async () => {
    const toastId = toast.loading(`Deleting all ${categoryFilter} analysis...`);

    try {
      setLoading(true);

      await pairAnalysisAPI.deleteAllByCategory(categoryFilter);

      setPairAnalysis([]);
      setTotalItems(0);
      setTotalPages(1);
      setPage(1);

      toast.success(`All ${categoryFilter} analysis deleted`, {
        id: toastId,
      });

      setShowDeleteAllConfirm(false);
    } catch (err) {
      toast.error(err.message || "Failed to delete all analysis", {
        id: toastId,
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="space-y-6">
      <AnalysisForm onSubmit={handleAdd} loading={formLoading} />

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {categoryFilter} Analysis ({totalItems})
          </h2>
          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E1A6F] outline-none"
          >
            <option value="Forex">Forex</option>
            <option value="Crypto">Crypto</option>
          </select>
        </div>

        <AnalysisTable
          data={pairAnalysis}
          loading={loading}
          onDelete={handleDelete}
        />

        {/* Pagination Controls */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="text-sm text-gray-700">
            Showing Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
          </div>
          <div className="flex space-x-2">
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage(prev => prev - 1)}
              className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage(prev => prev + 1)}
              className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>

        </div>

        {/* 🚨 Danger Zone */}
        <div className="border border-red-300 bg-red-50 rounded-lg p-6 mt-10">
          <h3 className="text-red-700 font-semibold text-lg mb-2">
            Danger Zone
          </h3>

          <p className="text-sm text-red-600 mb-4">
            This will permanently delete <b>ALL</b> analysis entries for the
            <b> {categoryFilter}</b> category. This action cannot be undone.
          </p>

          {!showDeleteAllConfirm ? (
            <button
              onClick={() => setShowDeleteAllConfirm(true)}
              disabled={loading || totalItems === 0}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Delete All {categoryFilter} Analysis
            </button>
          ) : (
            <div className="bg-white border border-red-400 rounded p-4">
              <p className="text-sm text-gray-800 mb-4">
                ⚠️ Are you sure you want to delete <b>ALL</b> {categoryFilter} analysis?
                <br />
                This action is <b>irreversible</b>.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAll}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  Yes, Delete Everything
                </button>

                <button
                  onClick={() => setShowDeleteAllConfirm(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default AnalysisSection;