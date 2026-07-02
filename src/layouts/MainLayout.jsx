import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const SIDEBAR_STORAGE_KEY = 'ck_admin_sidebar_open';

const MainLayout = ({ children }) => {
  // Initialise from localStorage so the user's open/closed choice
  // survives page navigations (MainLayout remounts on each route).
  // Default to open on desktop, closed on mobile.
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (window.innerWidth < 768) return false;
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  // Persist every change so the next page mount picks it up.
  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, isSidebarOpen ? 'true' : 'false');
    } catch {
      // ignore storage errors
    }
  }, [isSidebarOpen]);

  // On resize: force-close on mobile, but never force-open on desktop
  // so the user's explicit choice is always respected.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;  