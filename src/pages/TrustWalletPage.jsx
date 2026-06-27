import React, { useEffect, useState } from "react";
import { trustWalletApi } from "@/api/trustWalletApi";// your axios instance
import toast from "react-hot-toast";
import TrustWalletTable from "@/components/TrustWalletTable";
import MainLayout from "@/layouts/MainLayout";

const TrustWalletAdminPage = () => {
    const [walletData, setWalletData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTrustWallet = async () => {
        try {
            setLoading(true);
            const res = await trustWalletApi.getCredentials();
            setWalletData(res.data ?? null);
        } catch (err) {
            toast.error("Failed to load trust wallet credentials");
            setWalletData(null);
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrustWallet();
    }, []);

    const handleCreate = async (newData) => {
        await trustWalletApi.createCredentials(newData);
        toast.success("Trust wallet credentials created");
        await fetchTrustWallet();
    };

    const handleSave = async (newData) => {
        const payload = {};

        Object.keys(newData).forEach((key) => {
            if (newData[key] !== walletData[key]) {
                payload[key] = newData[key];
            }
        });

        if (Object.keys(payload).length === 0) {
            toast("No changes detected");
            return;
        }

        await trustWalletApi.updateCredentials(payload);
        toast.success("Trust wallet credentials updated");
        await fetchTrustWallet();
    };


    return (
        <MainLayout>

            <div className="p-6 max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Trust Wallet Configuration
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage Trust Wallet payment credentials used across the platform
                    </p>
                </div>

                <TrustWalletTable
                    data={walletData}
                    loading={loading}
                    onSave={handleSave}
                    onCreate={handleCreate}
                />
            </div>
        </MainLayout>
    );
};

export default TrustWalletAdminPage;
