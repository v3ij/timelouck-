import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Lock, LogOut, TrendingUp,
    Activity, Zap, Search, Bell, Settings, MoreHorizontal
} from 'lucide-react';

import Logo from '../components/Logo';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalRevenue: 0, activeLocks: 0, totalUsers: 0 });
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) { navigate('/login'); return; }

                const res = await fetch('/api/dashboard/admin-stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setStats(data.stats);
                    setDevices(data.devices || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) return <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center text-[#0A1F44]">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#F4F6F9] font-sans text-slate-800 flex">

            {/* Sidebar */}
            <aside className="w-64 bg-[#0A1F44] text-white fixed h-full hidden lg:flex flex-col p-6">
                {/* Replaced Icon Header with Logo Component */}
                <div className="mb-12">
                    <Logo />
                </div>

                <nav className="space-y-2 flex-1">
                    <NavItem icon={LayoutDashboard} label="Dashboard" path="/admin" active />
                    <NavItem icon={Users} label="User Management" path="/admin/users" />
                    <NavItem icon={Lock} label="Smart Locks" path="/admin/locks" />
                    <NavItem icon={Activity} label="Access Logs" path="/admin/logs" />
                    <NavItem icon={TrendingUp} label="Financials" path="/admin/finance" />
                    <NavItem icon={Settings} label="System Settings" path="/admin/settings" />
                </nav>

                <button onClick={handleLogout} className="flex items-center gap-3 text-red-300 hover:text-red-100 transition-colors mt-auto p-3">
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 flex-1 p-8">

                {/* Top Bar */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0A1F44]">Dashboard Overview</h2>
                        <p className="text-slate-500 text-sm">Welcome back, Administrator</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA500] w-64"
                            />
                        </div>
                        <button className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="w-10 h-10 bg-[#0A1F44] rounded-full flex items-center justify-center text-white font-bold">
                            AD
                        </div>
                    </div>
                </header>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <KPICard
                        title="Total Revenue"
                        value={`UGX ${stats.totalRevenue.toLocaleString()}`}
                        icon={TrendingUp}
                        stripColor="bg-[#FFA500]"
                    />
                    <KPICard
                        title="Active Locks"
                        value={stats.activeLocks}
                        icon={Lock}
                        stripColor="bg-[#1EC677]"
                    />
                    <KPICard
                        title="Total Users"
                        value={stats.totalUsers.toLocaleString()}
                        icon={Users}
                        stripColor="bg-blue-500"
                    />
                </div>

                {/* Door Management Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-[#0A1F44] text-lg">Door Management</h3>
                        <button className="text-sm font-medium text-[#FFA500] hover:text-orange-600">View All</button>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="px-6 py-4">Visual</th>
                                <th className="px-6 py-4">Device Name</th>
                                <th className="px-6 py-4">Model</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {devices.map((device, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    {/* Visual Column */}
                                    <td className="px-6 py-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${device.online_status ? 'bg-green-100' : 'bg-slate-100'}`}>
                                            {/* Smart Lock Handle SVG */}
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={device.online_status ? "#1EC677" : "#94A3B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="8" y="2" width="8" height="20" rx="2" />
                                                <circle cx="12" cy="14" r="2" />
                                                <path d="M12 12V14" />
                                            </svg>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-[#0A1F44]">{device.device_name}</td>
                                    <td className="px-6 py-4 text-slate-500">{device.model || 'N/A'}</td>
                                    <td className="px-6 py-4 text-slate-500">{device.location}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${device.online_status
                                            ? 'bg-[#1EC677]/10 text-[#1EC677]'
                                            : 'bg-red-500/10 text-red-500'
                                            }`}>
                                            {device.online_status ? 'ONLINE' : 'OFFLINE'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-[#0A1F44]">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {devices.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400 italic">No devices found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
    );
};

const NavItem = ({ icon: Icon, label, path, active }) => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(path)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left ${active
                ? 'bg-[#FFA500] text-[#0A1F44] font-bold shadow-lg shadow-orange-500/20'
                : 'text-blue-100 hover:bg-white/10'
                }`}>
            <Icon size={20} />
            <span>{label}</span>
        </button>
    );
};

const KPICard = ({ title, value, icon: Icon, stripColor }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center relative overflow-hidden group hover:shadow-md transition-all">
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${stripColor}`}></div>
        <div className="p-3 bg-slate-50 rounded-xl mr-5 group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-[#0A1F44]" />
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-[#0A1F44]">{value}</h3>
        </div>
    </div>
);

export default AdminDashboard;
