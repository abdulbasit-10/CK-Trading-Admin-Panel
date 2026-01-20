import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  MegaphoneIcon,
  ChevronDownIcon,
  CreditCardIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const mainMenuItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/' },
    { name: 'Home', icon: MegaphoneIcon, path: '/home' },
    { name: 'Verifications', icon: CheckBadgeIcon, path: '/verifications' },
    { name: 'Results', icon: CheckBadgeIcon, path: '/results' },
  ];

  const roleMenuItems = [
    { name: 'Users', icon: UserGroupIcon, path: '/users' },
    { name: 'Admins', icon: UserIcon, path: '/admins' },
    { name: 'Subscriptions', icon: CreditCardIcon, path: '/subscriptions' },
    { name: 'Partners', icon: UserGroupIcon, path: '/partners' },
    { name: 'Trust Wallet', icon: CreditCardIcon, path: '/trust-wallet' },
  ];

  const isActive = (path) => location.pathname === path;
  const isRoleMenuActive = roleMenuItems.some((item) => isActive(item.path));

  // Close sidebar on mobile when navigating
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:relative left-0 top-0 h-screen z-50 md:z-auto ${
          isOpen ? 'w-64' : 'w-0 md:w-20'
        } bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-all duration-300 ease-in-out overflow-hidden md:overflow-visible`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-500 md:border-b md:border-blue-500 h-16">
          {isOpen && (
            <h1 className="text-xl font-bold truncate">Trading Admin</h1>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-blue-500 rounded-lg transition ml-auto"
            aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <XMarkIcon className="w-5 h-5" />
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 space-y-2 px-3 md:px-4">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'hover:bg-blue-500 text-white'
                }`}
                title={!isOpen ? item.name : ''}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                {isOpen && (
                  <span className="font-medium truncate">{item.name}</span>
                )}
              </Link>
            );
          })}

          {/* Role Management Dropdown */}
          <div>
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isRoleMenuActive
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'hover:bg-blue-500 text-white'
              }`}
              aria-expanded={isRoleMenuOpen}
              title={!isOpen ? 'Role Management' : ''}
            >
              <UserGroupIcon className="w-6 h-6 flex-shrink-0" />
              {isOpen && (
                <>
                  <span className="font-medium flex-1 text-left truncate">
                    Role Management
                  </span>
                  <ChevronDownIcon
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                      isRoleMenuOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </>
              )}
            </button>

            {/* Role Submenu - Expanded */}
            {isOpen && isRoleMenuOpen && (
              <div className="mt-2 space-y-1 pl-4 border-l-2 border-blue-400">
                {roleMenuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={handleNavClick}
                      className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                        active
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'hover:bg-blue-500 text-blue-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Role Menu Popover - Collapsed */}
            {!isOpen && isRoleMenuOpen && (
              <div className="absolute left-20 top-48 bg-white rounded-lg shadow-xl py-2 z-50 w-max">
                {roleMenuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={handleNavClick}
                      className={`flex items-center space-x-3 px-4 py-2 transition whitespace-nowrap ${
                        active
                          ? 'bg-blue-100 text-blue-600'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-0 right-0 px-3 md:px-4">
          <button
            className="w-full flex items-center justify-center md:justify-start space-x-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition text-white font-medium"
            title={!isOpen ? 'Logout' : ''}
          >
            <ArrowLeftOnRectangleIcon className="w-6 h-6 flex-shrink-0" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;