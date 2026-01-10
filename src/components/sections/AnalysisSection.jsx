import React, { useState, useEffect, useCallback } from 'react';
import useHomeStore from '../../stores/homeStore';
import { pairAnalysisAPI } from '../../api/homeApi'; // Corrected import name
import AnalysisForm from '../AnalysisForm';
import AnalysisTable from '../AnalysisTable';

const AnalysisSection = () => {
  const { pairAnalysis, loading, setPairAnalysis, setLoading, setError } = useHomeStore();
  const [categoryFilter, setCategoryFilter] = useState('Forex');
  const [formLoading, setFormLoading] = useState(false);

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
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      try {
        await analysisPairAPI.delete(id);
        fetchAnalysis();
      } catch (err) {
        setError(err.message);
      }
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
      </div>
    </div>
  );
};

export default AnalysisSection;