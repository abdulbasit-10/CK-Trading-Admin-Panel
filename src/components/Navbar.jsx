import React, { useState } from 'react';
import { BellIcon, UserCircleIcon, Bars3Icon } from '@heroicons/react/24/solid';

const Navbar = ({ toggleSidebar }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifications = [
    { id: 1, message: 'New user verification pending', time: '5m ago' },
    { id: 2, message: 'System update completed', time: '1h ago' },
    { id: 3, message: 'New subscription request', time: '2h ago' },
  ];

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 h-16">
        {/* Left Section - Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition md:hidden"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="w-6 h-6 text-gray-600" />
        </button>

        {/* Center - Title (visible on mobile) */}
        <div className="flex-1 md:hidden text-center">
          <h2 className="text-lg font-bold text-gray-800">Trading Admin</h2>
        </div>

        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                setIsProfileOpen(false);
              }}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Notifications"
              aria-expanded={isNotificationOpen}
            >
              <BellIcon className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </button>

            {/* Notifications Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer last:border-b-0"
                      >
                        <p className="text-sm text-gray-700 font-medium">
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-200 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden md:block h-6 w-px bg-gray-200" />

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationOpen(false);
              }}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="User profile"
              aria-expanded={isProfileOpen}
            >
              <div className="hidden md:text-right md:block">
                <p className="text-sm font-semibold text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <UserCircleIcon className="w-10 h-10 text-blue-600" />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">admin@trading.com</p>
                </div>
                <div className="space-y-1 p-2">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition">
                    👤 Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition">
                    ⚙️ Preferences
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition">
                    🔐 Security
                  </button>
                </div>
                <div className="p-2 border-t border-gray-200">
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium">
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;