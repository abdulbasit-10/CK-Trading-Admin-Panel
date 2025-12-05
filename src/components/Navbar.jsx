import React from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/solid';

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition hidden md:block"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="flex items-center space-x-6">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <BellIcon className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-gray-800">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <UserCircleIcon className="w-10 h-10 text-blue-600" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
