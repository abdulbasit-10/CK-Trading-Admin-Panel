import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, UserCircleIcon, Bars3Icon } from '@heroicons/react/24/solid';

const Navbar = ({ toggleSidebar }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Refs to handle clicking outside to close menus
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const notifications = [
    { id: 1, message: 'New user verification pending', time: '5m ago' },
    { id: 2, message: 'System update completed', time: '1h ago' },
    { id: 3, message: 'New subscription request', time: '2h ago' },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 h-16">
        
        {/* LEFT: Mobile Sidebar Toggle */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* CENTER: Title (Visible on mobile to fill space) */}
        <div className="flex-1 md:hidden text-center">
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">Trading Admin</h2>
        </div>

        {/* RIGHT: Push everything to the end */}
        <div className="flex items-center justify-end flex-1 space-x-3 md:space-x-4">
          
          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                setIsProfileOpen(false);
              }}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Notifications"
            >
              <BellIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 border-b border-gray-50 hover:bg-blue-50 transition cursor-pointer last:border-b-0"
                      >
                        <p className="text-sm text-gray-700 font-medium">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-400 text-sm">No new notifications</div>
                  )}
                </div>
                <button className="w-full p-3 text-sm text-blue-600 hover:bg-gray-50 font-semibold border-t border-gray-100">
                  View All Activity
                </button>
              </div>
            )}
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block h-8 w-px bg-gray-200 mx-2" />

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationOpen(false);
              }}
              className="flex items-center gap-3 p-1 pr-2 hover:bg-gray-50 rounded-full md:rounded-lg transition"
            >
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-gray-800 leading-none">Admin User</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1">Administrator</p>
              </div>
              <UserCircleIcon className="w-9 h-9 text-blue-500" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 py-2">
                <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                  <p className="text-sm font-bold text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500 truncate">admin@trading.com</p>
                </div>
                
                <div className="px-2 pt-2">
                  <button className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition">
                    <span className="mr-3">👤</span> Profile Settings
                  </button>
                  <button className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition">
                    <span className="mr-3">⚙️</span> Preferences
                  </button>
                  <button className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition border-b border-gray-50">
                    <span className="mr-3">🔐</span> Security
                  </button>
                </div>

                <div className="px-2 pt-2">
                  <button className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-semibold">
                    <span className="mr-3">🚪</span> Logout
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