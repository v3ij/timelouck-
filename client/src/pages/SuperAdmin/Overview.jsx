import React, { useState, useEffect } from 'react';
import { fetchAdminStats, fetchAdminUsers, triggerGlobalTopup } from '../../services/api';
import { showToast } from '../../components/GlobalToast';

// Reusable SVG Icons to ensure zero-dependency drop-in
const WalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const MessageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
);

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const TrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const WarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const Overview = () => {
    const [stats, setStats] = useState({
        totalTenants: 0,
        activeUsers: 0,
        totalDevices: 0,
        totalRevenue: 0,
        systemHealth: 98
    });
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            const resStats = await fetchAdminStats();
            const resUsers = await fetchAdminUsers();

            if (resStats && resStats.status === 'success') {
                setStats(resStats.data);
            }
            if (resUsers && resUsers.status === 'success') {
                setUsers(resUsers.data);
            }
            setIsLoading(false);
        };
        loadStats();
    }, []);

    const handleGlobalTopup = async (amount = 5000) => {
        showToast('Processing Global Demo Topup...');
        const res = await triggerGlobalTopup(amount);
        if (res && res.status === 'success') {
            showToast(`Promo Event: Distributed UGX ${amount} to everyone!`);
            const resUsers = await fetchAdminUsers();
            if (resUsers && resUsers.status === 'success') setUsers(resUsers.data);
            const resStats = await fetchAdminStats();
            if (resStats && resStats.status === 'success') setStats(resStats.data);
        } else {
            showToast('Topup failed', 'error');
        }
    };

    const filteredUsers = users.filter((u) => u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-8">
            {/* Header Section */}
            <div className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#0A1F44] tracking-tight">Cortex Global Command</h1>
                    <p className="text-gray-500 mt-2 text-lg font-medium">SaaS Revenue & Hardware Overview</p>
                </div>
                {isLoading && (
                    <div className="px-4 py-2 bg-[#0A1F44]/10 text-[#0A1F44] rounded-full text-sm font-bold flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-[#0A1F44]"></span>
                        Syncing...
                    </div>
                )}
            </div>

            {/* Top Grid - 4 Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Card 1: Total Daily Revenue (Navy Blue Gradient Accent) */}
                <div className="bg-gradient-to-br from-[#0A1F44] to-[#143265] rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-white/20 p-3 rounded-xl text-white backdrop-blur-sm">
                            <WalletIcon />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-300 text-sm font-medium mb-1">Total System Revenue</p>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {isLoading ? '...' : `UGX ${stats.totalRevenue.toLocaleString()}`}
                        </h2>
                        <div className="flex items-center text-[#FFA500] text-sm font-semibold">
                            <TrendingUpIcon />
                            <span>Lifetime earnings</span>
                        </div>
                    </div>
                </div>

                {/* Card 2: Active Smart Locks */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-[#0A1F44]/5 p-3 rounded-xl text-[#0A1F44] group-hover:bg-[#0A1F44] group-hover:text-white transition-colors duration-300">
                            <LockIcon />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Active Smart Locks</p>
                        <h2 className="text-3xl font-bold text-[#0A1F44] mb-2 flex items-baseline gap-2">
                            {isLoading ? '...' : stats.totalDevices} <span className="text-lg font-medium text-gray-400">Online</span>
                        </h2>
                        <div className="flex items-center text-green-500 text-sm font-medium">
                            <TrendingUpIcon />
                            <span>All Systems Go</span>
                        </div>
                    </div>
                </div>

                {/* Card 3: SMS Notifications Sent */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-[#FFA500]/10 p-3 rounded-xl text-[#FFA500] group-hover:bg-[#FFA500] group-hover:text-white transition-colors duration-300">
                            <MessageIcon />
                        </div>
                        <span className="px-3 py-1 bg-[#FFA500]/10 text-[#FFA500] text-xs font-bold rounded-full border border-[#FFA500]/20">
                            Revenue Source
                        </span>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Total End Users</p>
                        <h2 className="text-3xl font-bold text-[#0A1F44] mb-2">
                            {isLoading ? '...' : stats.activeUsers} Active
                        </h2>
                        <div className="flex items-center text-green-500 text-sm font-medium">
                            <TrendingUpIcon />
                            <span>Across all tenants</span>
                        </div>
                    </div>
                </div>

                {/* Card 4: Total Tenants */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-gray-50 p-3 rounded-xl text-gray-600 group-hover:bg-gray-800 group-hover:text-white transition-colors duration-300">
                            <BuildingIcon />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Total Tenants</p>
                        <h2 className="text-3xl font-bold text-[#0A1F44] mb-2">
                            {isLoading ? '...' : stats.totalTenants} Active
                        </h2>
                        <p className="text-gray-500 text-sm font-medium">
                            Schools & Hotels Managed
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Split - 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Chart Placeholder (Spans 2 cols on large screens) */}
                <div className="lg:col-span-2 bg-[#09152b] rounded-2xl p-6 shadow-sm border border-[#143265] flex flex-col relative overflow-hidden h-[420px]">
                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FFA500] opacity-5 rounded-full blur-[80px] transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

                    <div className="relative z-10 mb-8">
                        <h3 className="text-xl font-bold text-white mb-1">Revenue vs Wallet Top-ups</h3>
                        <p className="text-[#FFA500] text-sm font-semibold tracking-wide uppercase">Last 7 Days</p>
                    </div>

                    {/* Simulated Chart Area */}
                    <div className="flex-1 flex items-end justify-between space-x-2 relative z-10 px-2 lg:px-8">
                        {/* Chart Grid Lines */}
                        <div className="absolute inset-x-2 lg:inset-x-8 inset-y-0 flex flex-col justify-between pointer-events-none">
                            <div className="w-full border-t border-white/5 border-dashed"></div>
                            <div className="w-full border-t border-white/5 border-dashed"></div>
                            <div className="w-full border-t border-white/5 border-dashed"></div>
                            <div className="w-full border-t border-white/5 border-dashed"></div>
                            <div className="w-full border-t border-white/5 border-dashed"></div>
                        </div>

                        {/* Render Bars */}
                        {[45, 60, 40, 85, 55, 100, 75].map((height, i) => (
                            <div key={i} className="flex-1 max-w-[48px] flex flex-col justify-end group cursor-pointer relative pt-4 h-full">
                                {/* Tooltip on hover */}
                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white text-[#0A1F44] text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg pointer-events-none">
                                    UGX {(height * 100000).toLocaleString()}
                                </div>
                                {/* The Bar */}
                                <div
                                    className="w-full rounded-t-md bg-gradient-to-t from-[#FFA500]/10 via-[#FFA500]/60 to-[#FFA500] transition-all duration-500 ease-out group-hover:via-[#FFA500]/80 group-hover:to-[#ffb732] shadow-[0_0_15px_rgba(255,165,0,0.1)] group-hover:shadow-[0_0_20px_rgba(255,165,0,0.3)] relative z-10"
                                    style={{ height: `${height}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between text-gray-500 font-medium text-xs mt-6 px-4 lg:px-10 relative z-10">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                </div>

                {/* Right Column: System Logs */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-[420px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-[#0A1F44]">System Logs</h3>
                        <button className="text-sm text-[#FFA500] font-semibold hover:text-[#e69500] transition-colors">View All</button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                        {/* Log Item 1 */}
                        <div className="flex items-start bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-green-500 mr-4 shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-[#0A1F44]">Kampala High</p>
                                <p className="text-sm text-gray-600 mt-0.5">500 SMS sent (Sync OK)</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-gray-400 font-medium tracking-wide font-mono px-2 py-0.5 bg-white rounded border border-gray-100">10:42 AM</span>
                                    <span className="text-xs text-green-600 font-medium">Completed</span>
                                </div>
                            </div>
                        </div>

                        {/* Log Item 2 */}
                        <div className="flex items-start bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-red-500 mr-4 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-[#0A1F44]">Hotel Africana</p>
                                <p className="text-sm text-gray-600 mt-0.5">TL90 Lock offline in Room 102</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-gray-400 font-medium tracking-wide font-mono px-2 py-0.5 bg-white rounded border border-gray-100">09:15 AM</span>
                                    <span className="text-xs text-red-600 font-medium">Alert</span>
                                </div>
                            </div>
                        </div>

                        {/* Log Item 3 */}
                        <div className="flex items-start bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-[#FFA500] mr-4 shrink-0 shadow-[0_0_8px_rgba(255,165,0,0.4)]"></div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-[#0A1F44]">Wallet Top-up</p>
                                <p className="text-sm text-gray-600 mt-0.5">UGX 50,000 via MTN Mobile Money</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-gray-400 font-medium tracking-wide font-mono px-2 py-0.5 bg-white rounded border border-gray-100">Yesterday</span>
                                    <span className="text-xs text-[#FFA500] font-medium">Finance</span>
                                </div>
                            </div>
                        </div>

                        {/* Log Item 4 (To simulate scrolling if needed) */}
                        <div className="flex items-start bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-green-500 mr-4 shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-[#0A1F44]">Makerere Univ.</p>
                                <p className="text-sm text-gray-600 mt-0.5">System routine backup completed</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-gray-400 font-medium tracking-wide font-mono px-2 py-0.5 bg-white rounded border border-gray-100">Yesterday</span>
                                    <span className="text-xs text-green-600 font-medium">System</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* User Management Table */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sm:flex-row flex-col gap-4">
                    <h3 className="text-xl font-bold text-[#0A1F44]">User Management</h3>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#0A1F44]/20"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4 text-center">Wallet Balance</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-[#0A1F44]">{user.full_name}</td>
                                    <td className="p-4 text-gray-600">{user.email}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.balance > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            UGX {parseFloat(user.balance).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleGlobalTopup(5000)}
                                            className="px-3 py-1.5 bg-[#0A1F44] text-white rounded-lg text-xs font-bold hover:bg-[#153063] transition-colors"
                                        >
                                            Demo Top-up
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500 font-medium">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Overview;
