import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
      <div className="text-center space-y-4">
        <div className="text-red-500 text-7xl font-bold">403</div>
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="text-gray-400 text-sm max-w-sm">
          You are not authorized to access this page. This section is restricted to Super Admins only.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
