import React from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';

const AnalysisTable = ({ data, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4E1A6F]"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No pair analysis available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((analysis) => (
        <div
          key={analysis.analysis_id}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
        >
          {/* ...existing code... */}
          {analysis.graph_image_url && (
            <div className="w-full h-48 bg-gray-100 overflow-hidden">
              <img
                src={`${analysis.graph_image_url}`}
                alt={analysis.symbol}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-gray-900">{analysis.symbol}</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  analysis.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {analysis.status}
              </span>
            </div>

            <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded mb-3">
              {analysis.category}
            </span>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {analysis.description}
            </p>

            <div className="text-xs text-gray-500 mb-4">
              Created: {new Date(analysis.created_at).toLocaleDateString()}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => onDelete(analysis.analysis_id)}
                className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalysisTable;