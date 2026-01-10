import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import ResultForm from "@/components/ResultForm";
import ResultTable from "@/components/ResultTable";
import { resultAPI } from "../api/resultApi";
import toast from "react-hot-toast";

const Result = () => {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = async () => {
    try {
      setLoading(true);

      const res = await resultAPI.getAll({
        page,
        limit,
        filter
      });
      setResults(res.data.results);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [page, filter]);

  const handleCreateResult = async (data) => {
    try {
      setLoading(true);
      await resultAPI.createResult(data);
      toast.success("Result created successfully");
      setPage(1);
      fetchResults();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create result";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this result?")) return;

    try {
      await resultAPI.delete(id);
      toast.success("Result deleted");
      fetchResults();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      setLoading(true);
      // Assuming your API has an update method
      await resultAPI.update(id, updatedData);
      toast.success("Result updated successfully");
      fetchResults(); // Refresh data
    } catch (err) {
      toast.error("Failed to update result");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Results</h1>
          <p className="text-gray-600">Add Result of Analysis or Signals</p>
        </div>

        {error && (
          <div className="bg-red-50 p-3 rounded text-red-700">
            {error}
          </div>
        )}

        <ResultForm onSubmit={handleCreateResult} loading={loading} />

        <ResultTable
          results={results}
          onUpdate={handleUpdate} // Changed from onEdit to onUpdate
          onDelete={handleDelete}
        />

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          <div className="space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Result;
