import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Back Button for better UX */}
      <div className="max-w-3xl mx-auto mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-slate-500 hover:text-[#4E1A6F] flex items-center transition-colors"
        >
          ← Back to App
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white shadow-sm border border-slate-200 rounded-2xl p-8 sm:p-12">
        <header className="mb-10 border-b border-slate-100 pb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Privacy Policy</h1>
          <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-slate-500 gap-2">
            <p><span className="font-semibold text-slate-700">App:</span> CkNetwork</p>
            <p><span className="font-semibold text-slate-700">Last Updated:</span> February 22, 2026</p>
          </div>
        </header>

        <section className="space-y-10 text-slate-600 leading-relaxed">
          <p className="text-lg">
            At <strong>CkNetwork</strong>, we prioritize the privacy and security of our users. This policy outlines how we handle your data to provide a secure administrative and networking experience.
          </p>

          {/* 1. Data Collection */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-purple-100 text-[#4E1A6F] rounded-full flex items-center justify-center mr-3 text-sm">1</span>
              Information We Collect
            </h2>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-[#4E1A6F] font-bold">•</span>
                  <span><strong>Account Information:</strong> Name, email address, and authentication credentials provided during registration.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#4E1A6F] font-bold">•</span>
                  <span><strong>Device Identifiers:</strong> We collect push notification tokens (FCM/Device tokens) to provide real-time updates and security alerts.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#4E1A6F] font-bold">•</span>
                  <span><strong>Usage Data:</strong> Basic technical logs including app version and operating system to ensure compatibility and security.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 2. Account Deletion - MANDATORY FOR APPLE/GOOGLE */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
              Data Retention & Deletion
            </h2>
            <p className="mb-4">
              We retain your information only as long as your account is active. We support your "Right to be Forgotten":
            </p>
            <div className="bg-red-50/50 rounded-xl p-5 border border-red-100">
              <p className="text-slate-700 font-medium">To delete your account and all associated data:</p>
              <p className="mt-2 text-sm">
                Please contact us at <span className="font-bold text-red-600 underline">Mkalitrader@gmail.com</span>. Once requested, your personal data will be purged from our active databases within 30 days.
              </p>
            </div>
          </div>

          {/* 3. Push Notifications */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-purple-100 text-[#4E1A6F] rounded-full flex items-center justify-center mr-3 text-sm">3</span>
              Push Notifications
            </h2>
            <p>
              With your consent, we may send push notifications to your mobile device to provide app updates and security alerts. You may opt-out of these at any time by changing the notification settings on your mobile device.
            </p>
          </div>

          {/* 4. Security */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-purple-100 text-[#4E1A6F] rounded-full flex items-center justify-center mr-3 text-sm">4</span>
              Security Measures
            </h2>
            <p>
              We implement industry-standard encryption and security protocols (SSL/TLS) to protect your data during transit and at rest. Access to user data is strictly limited to authorized personnel.
            </p>
          </div>

          {/* 5. Contact */}
          <div className="pt-8 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Contact Information</h2>
            <p className="text-sm">
              If you have any questions about this Privacy Policy or our data practices, please reach out to:
            </p>
            <div className="mt-4 p-4 bg-[#FF9201] rounded-lg text-white">
              <p className="font-semibold text-sm opacity-90">Support Email:</p>
              <p className="text-lg font-mono">Mkalitrader@gmail.com</p>
            </div>
          </div>
        </section>

        <footer className="mt-12 text-center text-xs text-slate-400 uppercase tracking-widest">
          © 2026 CkNetwork. Secure Management Systems.
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;