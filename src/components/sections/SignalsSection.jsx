import React, { useState, useEffect } from "react";
import useHomeStore from "../../stores/homeStore";
import SignalForm from "../signalForm";
import SignalTable from "../SignalTable";
import { signalAPI } from "../../api/homeApi";
import toast from "react-hot-toast";

const SignalsSection = () => {
  const { loading, setLoading, setError } = useHomeStore();

  const [signals, setSignals] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // --- New State for Updates ---
  const [editingSignal, setEditingSignal] = useState(null);

  const fetchSignals = async (p = page) => {
    setLoading(true);
    try {
      const res = await signalAPI.getSignals(p, limit);
      setSignals(res.data);
      setTotal(res.total);
      setPage(res.page);
    } catch (err) {
      setError(err.message || "Failed to load signals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals(page);
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this signal?")) return;

    try {
      setLoading(true);
      await signalAPI.deleteSignal(id);

      const isLastItemOnPage = signals.length === 1 && page > 1;
      const targetPage = isLastItemOnPage ? page - 1 : page;
      
      await fetchSignals(targetPage);
      toast.success("Signal deleted successfully");
    } catch (err) {
      setError(err.message || "Failed to delete the signal");
      toast.error("Failed to delete the signal");
    } finally {
      setLoading(false);
    }
  };

  // --- Edit Handlers ---
  const handleEditClick = (signal) => {
    setEditingSignal(signal);
    // Scroll to form for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingSignal(null);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <SignalForm 
        editingSignal={editingSignal} 
        onCancelEdit={handleCancelEdit}
        onSuccess={() => {
          fetchSignals(editingSignal ? page : 1); // Stay on page if update, go to 1 if create
          setEditingSignal(null);
        }} 
      />

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Signals</h2>

        <SignalTable
          data={signals}
          loading={loading}
          onDelete={handleDelete}
          onUpdate={handleEditClick} // Passed to table pencil icon
        />

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

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
  );
};

export default SignalsSection;