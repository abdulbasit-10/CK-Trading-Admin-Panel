import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import AnnouncementsSection from '../components/sections/AnnouncementsSection';
import AnalysisSection from '../components/sections/AnalysisSection';
import SignalsSection from '../components/sections/SignalsSection';

const Home = () => {
  const [activeTab, setActiveTab] = useState('announcements');

  const tabs = [
    { id: 'announcements', label: 'Announcements' },
    { id: 'analysis', label: 'Pair Analysis' },
    { id: 'signals', label: 'Signals' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Home Management</h1>
          <p className="text-gray-600 mt-2">
            Manage announcements, analysis, and signals for the mobile app.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conditional Rendering of Sections */}
        <div className="mt-6">
          {activeTab === 'announcements' && <AnnouncementsSection />}
          {activeTab === 'analysis' && <AnalysisSection />}
          {activeTab === 'signals' && <SignalsSection />}
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;