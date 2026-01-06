import React, { useState, useEffect } from "react";
import useHomeStore from "../../stores/homeStore";
import SignalForm from "../signalForm";
import SignalTable from "../SignalTable";
import { signalAPI } from "../../api/homeApi";

const SignalsSection = () => {
  const { loading, setLoading, setError } = useHomeStore();

  const [signals, setSignals] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

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
    if (!confirm("Delete this signal?")) return;
    try {
      await signalAPI.deleteSignal(id);
      fetchSignals(page);
    } catch (err) {
      setError(err.message);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <SignalForm onCreated={() => fetchSignals(1)} />

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Signals</h2>

        <SignalTable
          data={signals}
          loading={loading}
          onDelete={handleDelete}
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
