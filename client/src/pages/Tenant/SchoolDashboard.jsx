import React from 'react';
import { Users, Clock, AlertCircle, MessageSquare, Calendar, BookOpen, Send, FileText } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { showToast } from '../../components/GlobalToast';

const SchoolDashboard = () => {
    // HARDCODED SCHOOL DATA
    const stats = [
        { label: 'Total Students', value: '1,250', sub: 'Active Enrolment', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: "Today's Attendance", value: '92%', sub: '1,150 Present', icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Late Arrivals', value: '45', sub: 'Requires Attention', icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'SMS Sent', value: '1,200', sub: 'Parent Notifications', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    const attendanceTrend = [
        { day: 'Mon', value: 94 },
        { day: 'Tue', value: 92 },
        { day: 'Wed', value: 95 },
        { day: 'Thu', value: 91 },
        { day: 'Fri', value: 88 },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex">
            {/* 1. Sidebar will be handled by the layout wrapper, but if we use this standalone we might need it. 
                However, for consistency with the new 'TenantEcosystem' pattern, we should wrap this or include Sidebar. 
                Based on previous steps, pages included Sidebar directly. */}
            <Sidebar />

            {/* 2. Main Content */}
            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">School Dashboard</h1>
                        <p className="text-slate-500">Academic Overview • Term 1 2026</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                showToast('Compiling Term Report...');
                                setTimeout(() => window.print(), 500);
                            }}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
                        >
                            Download Report
                        </button>
                        <button
                            onClick={() => showToast('Module Ready for Future Integration: New Student Enrollment')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200"
                        >
                            + New Student
                        </button>
                    </div>
                </div>

                {/* 3. Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={stat.color} size={24} />
                                </div>
                                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">{'+2%'}</span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                                <p className="text-xs text-slate-400 mt-2">{stat.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Weekly Attendance Chart (Visual Mock) */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Calendar size={18} className="text-slate-400" />
                                Weekly Attendance Trend
                            </h3>
                            <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-1 text-slate-600">
                                <option>This Week</option>
                                <option>Last Week</option>
                            </select>
                        </div>

                        {/* Bar Chart Mock functionality */}
                        <div className="h-64 flex items-end justify-between gap-4 px-4">
                            {attendanceTrend.map((item, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="relative w-full bg-blue-50 rounded-t-lg h-full overflow-hidden">
                                        <div
                                            className="absolute bottom-0 left-0 w-full bg-blue-500 rounded-t-lg transition-all duration-500 group-hover:bg-blue-600"
                                            style={{ height: `${item.value}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">{item.day}</span>
                                    <span className="text-xs font-bold text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-20 bg-white shadow-md px-2 py-1 rounded border border-slate-100">
                                        {item.value}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-bold text-slate-800 mb-6">Quick Actions</h3>
                        <div className="space-y-3">
                            <button onClick={() => showToast('Module Ready: Sending Bulk Absence Alert')} className="w-full text-left px-4 py-4 rounded-xl bg-orange-50 hover:bg-orange-100 flex items-center gap-4 transition-colors group">
                                <div className="p-2 bg-white rounded-lg text-orange-500 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-700">Send Absence Alert</p>
                                    <p className="text-xs text-orange-600/80">Notify 45 Parents</p>
                                </div>
                            </button>

                            <button onClick={() => showToast('Module Ready: Manage Class Schedules')} className="w-full text-left px-4 py-4 rounded-xl bg-blue-50 hover:bg-blue-100 flex items-center gap-4 transition-colors group">
                                <div className="p-2 bg-white rounded-lg text-blue-500 shadow-sm group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-700">Class Schedules</p>
                                    <p className="text-xs text-blue-600/80">Update Layouts</p>
                                </div>
                            </button>

                            <button onClick={() => showToast('Module Ready: New Announcement')} className="w-full text-left px-4 py-4 rounded-xl bg-purple-50 hover:bg-purple-100 flex items-center gap-4 transition-colors group">
                                <div className="p-2 bg-white rounded-lg text-purple-500 shadow-sm group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                    <Send size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-700">Announcement</p>
                                    <p className="text-xs text-purple-600/80">SMS & Email</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SchoolDashboard;
