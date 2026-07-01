import React, { useEffect, useState } from "react";
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/solid";
import MainLayout from "../layouts/MainLayout";
import apiClient from "../api/client";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiClient.get("/admin/dashboard/stats");
        const { stats, recentUsers, adminTeam } = response.data.data;

        setStats([
          {
            title: "Total Users",
            value: stats.totalUsers,
            icon: UserGroupIcon,
            color: "blue",
          },
          {
            title: "Total Admins",
            value: stats.totalAdmins,
            icon: UserIcon,
            color: "green",
          },
        ]);

        setRecentUsers(recentUsers);
        setAdmins(adminTeam);
      } catch (error) {
        console.error("Dashboard fetch failed", error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: "bg-purple-50 border-purple-200",
              green: "bg-green-50 border-green-200",
            };

            return (
              <div
                key={idx}
                className={`${colorClasses[stat.color]} border rounded-lg p-6`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className="w-12 h-12 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Recent Users
            </h2>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.full_name}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.is_verified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.is_verified ? "active" : "inactive"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Team */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Admin Team
            </h2>
            <div className="space-y-3">
              {admins.map((admin) => (
                <div
                  key={admin.user_id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {admin.full_name}
                    </p>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    {admin.role_name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
