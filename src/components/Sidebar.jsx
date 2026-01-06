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
  ];

  const isActive = (path) => location.pathname === path;
  const isRoleMenuActive = roleMenuItems.some((item) => isActive(item.path));

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between p-4 border-b border-blue-500">
        {isOpen && <h1 className="text-xl font-bold">Trading Admin</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-blue-500 rounded-lg transition"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <nav className="mt-8 space-y-2 px-4">
        {mainMenuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'hover:bg-blue-500 text-white'
              }`}
            >
              <Icon className="w-6 h-6 flex-shrink-0" />
              {isOpen && <span className="font-medium">{item.name}</span>}
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
          >
            <UserGroupIcon className="w-6 h-6 flex-shrink-0" />
            {isOpen && (
              <>
                <span className="font-medium flex-1 text-left">
                  Role Management
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isRoleMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </>
            )}
          </button>

          {/* Role Submenu */}
          {isOpen && isRoleMenuOpen && (
            <div className="mt-2 space-y-1 pl-4">
              {roleMenuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                      active
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-blue-500 text-blue-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Role Menu Icon for Collapsed State */}
          {!isOpen && isRoleMenuOpen && (
            <div className="absolute left-20 top-32 bg-white rounded-lg shadow-xl py-2 z-50">
              {roleMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 text-gray-700 transition whitespace-nowrap"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      <div className="bottom-4 left-4 right-4">
        <button className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition text-white">
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
