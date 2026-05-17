import React, { useState, useEffect } from 'react';
import { fetchAdminStats, fetchAdminTenants } from '../../services/api';
import { showToast } from '../../components/GlobalToast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Inbox } from 'lucide-react';

// Reusable SVG Icons
const WalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
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

const SuperAdminDashboard = () => {
    const [stats, setStats] = useState({
        totalTenants: 0,
        totalRevenue: 0,
        activeUsers: 0,
        totalDevices: 0,
        industryStats: []
    });
    const [tenants, setTenants] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // New Tenant Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newTenantData, setNewTenantData] = useState({ name: '', type: 'school' });

    useEffect(() => {
        const loadDashboard = async () => {
            const resStats = await fetchAdminStats();
            const resTenants = await fetchAdminTenants();

            if (resStats && resStats.status === 'success') {
                setStats(resStats.data);
            }
            if (resTenants && resTenants.status === 'success') {
                setTenants(resTenants.data);
            }
            setIsLoading(false);
        };
        loadDashboard();
    }, []);

    const handleToggleStatus = (tenantName) => {
        showToast(`Dummy Action: Toggled Suspension Status for ${tenantName}`);
    };

    const handleDownloadReport = () => {
        showToast('Generating Global Revenue Report PDF...');
        setTimeout(() => window.print(), 800);
    };

    const handleCreateTenant = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/tenants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTenantData)
            });
            const data = await res.json();
            if (data.status === 'success') {
                showToast(`Successfully created ${newTenantData.type}: ${newTenantData.name}`);
                setTenants([data.data, ...tenants]);
                setIsCreateModalOpen(false);
                setNewTenantData({ name: '', type: 'school' });
            } else {
                showToast(data.message || 'Failed to create tenant');
            }
        } catch (err) {
            showToast('Error creating tenant');
        }
    };

    const filteredTenants = tenants.filter(t =>
        t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-8">
            <div className="mb-10 flex justify-between items-start sm:flex-row flex-col gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#0A1F44] tracking-tight">System Owner Dashboard</h1>
                    <p className="text-gray-500 mt-2 text-lg font-medium">Global Revenue & Multi-Tenant Management</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                    {isLoading && (
                        <div className="px-4 py-2 bg-[#0A1F44]/10 text-[#0A1F44] rounded-full text-sm font-bold flex items-center gap-2">
                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-[#0A1F44]"></span>
                            Syncing API...
                        </div>
                    )}
                    <button
                        onClick={handleDownloadReport}
                        className="flex items-center gap-2 bg-[#0A1F44] hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                    >
                        <Download size={18} />
                        <span className="font-bold text-sm">Download Global Revenue Report (PDF)</span>
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Global Revenue */}
                <div className="bg-gradient-to-br from-[#0A1F44] to-[#143265] rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-white/20 p-3 rounded-xl text-white backdrop-blur-sm">
                            <WalletIcon />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-300 text-sm font-medium mb-1">Global System Revenue</p>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {isLoading ? '...' : `UGX ${stats.totalRevenue.toLocaleString()}`}
                        </h2>
                        <div className="flex items-center text-[#FFA500] text-sm font-semibold">
                            <TrendingUpIcon />
                            <span>Total Volume across all nodes</span>
                        </div>
                    </div>
                </div>

                {/* Total Tenants */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-gray-50 p-3 rounded-xl text-gray-600 group-hover:bg-[#0A1F44] group-hover:text-white transition-colors duration-300">
                            <BuildingIcon />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Total Active Tenants</p>
                        <h2 className="text-3xl font-bold text-[#0A1F44] mb-2">
                            {isLoading ? '...' : stats.totalTenants}
                        </h2>
                        <p className="text-gray-500 text-sm font-medium">Registered Schools & Hotels</p>
                    </div>
                </div>

                {/* Global Active Users */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-[#FFA500]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-[#FFA500]/10 p-3 rounded-xl text-[#FFA500] group-hover:bg-[#FFA500] group-hover:text-white transition-colors duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Global Active Users</p>
                        <h2 className="text-3xl font-bold text-[#0A1F44] mb-2">
                            {isLoading ? '...' : stats.activeUsers}
                        </h2>
                        <p className="text-gray-500 text-sm font-medium">End-Users Transacting</p>
                    </div>
                </div>
            </div>

            {/* Industry Breakdown (Dynamic) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                <h3 className="text-xl font-bold text-[#0A1F44] mb-6">Industry Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.industryStats && stats.industryStats.length > 0 ? (
                        stats.industryStats.map((ind, idx) => (
                            <div key={idx} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-[#0A1F44] capitalize">{ind.type}</p>
                                    <p className="text-xs text-gray-500">{ind.total_users} Users</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-[#1EC677]">UGX {parseFloat(ind.total_balance).toLocaleString()}</p>
                                    <p className="text-xs text-gray-400">Total Holdings</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No industry data available yet.</p>
                    )}
                </div>
            </div>

            {/* Revenue Growth Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                <h3 className="text-xl font-bold text-[#0A1F44] mb-6">Monthly Revenue Growth (UGX)</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                            { name: 'Week 1', revenue: 120000 },
                            { name: 'Week 2', revenue: 180000 },
                            { name: 'Week 3', revenue: 250000 },
                            { name: 'Week 4', revenue: 450000 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} tickFormatter={(value) => `UGX ${value / 1000}k`} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value) => [`UGX ${value.toLocaleString()}`, 'Revenue']}
                            />
                            <Line type="monotone" dataKey="revenue" stroke="#0A1F44" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, fill: '#FFA500', stroke: '#fff', strokeWidth: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tenant Data Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sm:flex-row flex-col gap-4">
                    <h3 className="text-xl font-bold text-[#0A1F44]">Registered Networks (Tenants)</h3>

                    <div className="flex gap-3 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search schools or hotels..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#0A1F44]/20"
                        />
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-[#1EC677] hover:bg-[#17a562] text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap"
                        >
                            + Add Tenant
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="p-4">Organization Name</th>
                                <th className="p-4">Type</th>
                                <th className="p-4 text-center">Active End-Users</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredTenants.map((tenant) => (
                                <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-[#0A1F44] flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#0A1F44]/5 flex items-center justify-center text-[#0A1F44]">
                                            <BuildingIcon />
                                        </div>
                                        {tenant.name}
                                    </td>
                                    <td className="p-4 text-gray-600 capitalize">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${tenant.type === 'school' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {tenant.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center font-semibold text-gray-700">
                                        {tenant.user_count}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 flex items-center justify-center gap-1 w-max mx-auto">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleToggleStatus(tenant.name)}
                                            className="px-3 py-1.5 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            Suspend
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTenants.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-gray-500 font-medium bg-gray-50/50">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Inbox size={48} className="text-gray-300" />
                                            <p>No registered networks found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Tenant Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">Add New Tenant</h2>
                        <form onSubmit={handleCreateTenant} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Name (e.g. Oxford High)</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0A1F44]"
                                    value={newTenantData.name}
                                    onChange={(e) => setNewTenantData({ ...newTenantData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Industry Type</label>
                                <select
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0A1F44] capitalize"
                                    value={newTenantData.type}
                                    onChange={(e) => setNewTenantData({ ...newTenantData, type: e.target.value })}
                                >
                                    <option value="school">School</option>
                                    <option value="hotel">Hotel</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="gym">Gym / Fitness</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#0A1F44] text-white rounded-lg font-bold"
                                >
                                    Create Tenant
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;
