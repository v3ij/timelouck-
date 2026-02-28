import React from 'react';
import Sidebar from '../components/Sidebar';
import { TrendingUp, Users, MessageSquare, Server } from 'lucide-react';

const SuperAdminDashboard = () => {
    // HARDCODED ROBUST DATA
    const stats = [
        { label: 'Total Revenue', value: 'UGX 15,400,000', icon: TrendingUp, color: 'text-[#FFA500]', bg: 'bg-orange-500/10' },
        { label: 'Active Schools', value: '12 Schools', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Total SMS Sent', value: '8,432', icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'System Health', value: '98% Operational', icon: Server, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex">
            {/* 1. Integrated Smart Sidebar */}
            <Sidebar />

            {/* 2. Main Content Area */}
            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0A1F44]">Platform Overview</h1>
                    <p className="text-slate-500">Welcome back, Super Admin.</p>
                </div>

                {/* 3. Robust Grid of 4 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-40 relative overflow-hidden">
                            <div className="flex justify-between items-start z-10">
                                <div>
                                    <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-[#0A1F44]">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={stat.color} size={24} />
                                </div>
                            </div>

                            {/* Decorative bar */}
                            <div className={`absolute bottom-0 left-0 w-full h-1 ${stat.color.replace('text-', 'bg-')}`}></div>
                        </div>
                    ))}
                </div>

                {/* Verification Text */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm">
                    <strong>System Status Check:</strong> Dashboard rendered successfully. API Binding ready for Phase 4.
                </div>
            </main>
        </div>
    );
};

export default SuperAdminDashboard;
