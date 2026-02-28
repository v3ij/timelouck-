import React from 'react';
import SuperAdminLayout from '../../layouts/SuperAdminLayout';
import { TrendingUp, Users, MessageSquare, Server, AlertTriangle, CheckCircle, Download, MoreHorizontal } from 'lucide-react';
import { showToast } from '../../components/GlobalToast';

const GlobalOverview = () => {

    // STRICT DATA POINTS [cite: 249, 344]
    const metrics = [
        {
            label: 'Total Active Tenants',
            value: '17',
            sub: '12 Schools, 5 Hotels',
            icon: Users,
            trend: '+2 this week',
            color: 'text-blue-400',
            bg: 'bg-blue-400/10'
        },
        {
            label: 'Global Daily Revenue',
            value: 'UGX 15.4M',
            sub: 'Avg. per Tenant: UGX 905k',
            icon: TrendingUp,
            trend: '+18.2% vs last mo',
            color: 'text-[#FFA500]',
            bg: 'bg-orange-400/10'
        },
        {
            label: 'Total SMS Sent',
            value: '8,432',
            sub: 'Primary Revenue Source',
            icon: MessageSquare,
            trend: '98% Delivery Rate',
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10'
        },
        {
            label: 'System Health',
            value: '98%',
            sub: 'All Systems Operational',
            icon: Server,
            trend: 'Uptime (30 days)',
            color: 'text-purple-400',
            bg: 'bg-purple-400/10'
        },
    ];

    const tenants = [
        { id: 'T-001', name: 'Kampala Int. School', type: 'School', sub: 'Premium Plan', lastSync: '2 mins ago', status: 'Active' },
        { id: 'T-002', name: 'Serena Heights Hotel', type: 'Hotel', sub: 'Enterprise Plan', lastSync: '15 mins ago', status: 'Active' },
        { id: 'T-003', name: 'City High School', type: 'School', sub: 'Basic Plan', lastSync: '1 hr ago', status: 'Warning' },
        { id: 'T-004', name: 'Entebbe Resort', type: 'Hotel', sub: 'Standard Plan', lastSync: '5 mins ago', status: 'Active' },
        { id: 'T-005', name: 'Makerere College', type: 'School', sub: 'Premium Plan', lastSync: 'Just now', status: 'Active' },
    ];

    return (
        <SuperAdminLayout>
            {/* Page Header */}
            <div className="flex justify-between items-end mb-10 text-white">
                <div>
                    <h2 className="text-3xl font-bold mb-1">Global Command Center</h2>
                    <p className="text-blue-200/60 font-medium">Real-time oversight of all SaaS operations.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => showToast('Module Ready for API Binding')}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-sm font-medium transition-colors border border-white/10"
                    >
                        Refresh Data
                    </button>
                    <button
                        onClick={() => showToast('Module Ready for API Binding')}
                        className="px-4 py-2 bg-[#FFA500] hover:bg-orange-400 text-[#0A1F44] rounded-lg text-sm font-bold shadow-lg shadow-orange-500/20 transition-colors"
                    >
                        Export Report
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {metrics.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon size={24} className={stat.color} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-[#0A1F44] mb-1 tracking-tight">{stat.value}</h3>
                        <p className="text-slate-500 text-sm font-medium mb-4">{stat.label}</p>
                        <div className="pt-4 border-t border-slate-50">
                            <p className="text-xs text-slate-400 font-medium">{stat.sub}</p>
                        </div>
                        {/* Decorative accent */}
                        <div className={`absolute bottom-0 left-0 h-1 w-full ${stat.color.replace('text-', 'bg-')} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tenant Management Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h3 className="text-lg font-bold text-[#0A1F44]">Tenant Management</h3>
                            <p className="text-xs text-slate-500">Live Status of 17 Active Clients</p>
                        </div>
                        <button onClick={() => showToast('Module Ready for API Binding')} className="text-sm font-medium text-[#FFA500] hover:text-orange-600">
                            View All Tenants
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Client Name</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Subscription</th>
                                    <th className="px-6 py-4">Last Sync</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {tenants.map((t, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-[#0A1F44] text-sm">{t.name}</p>
                                            <p className="text-xs text-slate-400">ID: {t.id}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${t.type === 'School' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">{t.sub}</td>
                                        <td className="px-6 py-4 text-slate-500 text-xs font-mono">{t.lastSync}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => showToast(`Module Ready for API Binding: Suspending ${t.name}`)}
                                                className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-colors"
                                            >
                                                Suspend
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Government Data Feed Card */}
                <div className="flex flex-col gap-6">
                    <div className="bg-[#0A1F44] rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
                        {/* Background Deco */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFA500] rounded-full blur-[60px] opacity-20"></div>

                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                <Database className="text-[#FFA500]" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Government Data Feed</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span className="text-xs text-emerald-300 font-mono">Ready to Push</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-300">Compliance Score</span>
                                    <span className="text-[#FFA500] font-bold">98/100</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-1.5">
                                    <div className="bg-[#FFA500] h-1.5 rounded-full w-[98%]"></div>
                                </div>
                            </div>

                            <p className="text-xs text-slate-400 leading-relaxed">
                                Data packet for Ministry of Education is compiled and ready. Includes attendance logs for all 12 schools.
                            </p>

                            <button
                                onClick={() => showToast('Module Ready for API Binding: Exporting Report...')}
                                className="w-full py-3 bg-white text-[#0A1F44] font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <Download size={16} />
                                Export National Report
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-[#0A1F44] mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button onClick={() => showToast('Module Ready')} className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between group transition-colors">
                                <span className="text-sm font-medium text-slate-700">Add New Tenant</span>
                                <div className="w-6 h-6 rounded-full bg-white text-slate-400 group-hover:text-[#FFA500] flex items-center justify-center shadow-sm">
                                    +
                                </div>
                            </button>
                            <button onClick={() => showToast('Module Ready')} className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between group transition-colors">
                                <span className="text-sm font-medium text-slate-700">Broadcast System Alert</span>
                                <AlertTriangle size={14} className="text-slate-400 group-hover:text-amber-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
};

export default GlobalOverview;
