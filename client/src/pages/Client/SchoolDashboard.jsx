import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, MessageSquare, CreditCard, LogOut, CheckCircle, AlertCircle } from 'lucide-react';

const SchoolDashboard = () => {
    const navigate = useNavigate();

    // Mock School Stats
    const stats = [
        { title: "Today's Attendance", value: '842', sub: '/ 1200 Students', icon: Users, color: 'bg-blue-100 text-blue-600' },
        { title: 'SMS Notifications', value: '1,240', sub: 'Sent Today', icon: MessageSquare, color: 'bg-green-100 text-green-600' },
        { title: 'Est. Cost', value: 'UGX 125k', sub: 'Low Balance', icon: CreditCard, color: 'bg-orange-100 text-orange-600' },
    ];

    // Mock Live Entry Feed
    const entries = [
        { id: 101, student: 'David Ochieng', class: 'S4-East', time: '07:45 AM', status: 'On Time', sms: 'Sent (Paid)' },
        { id: 102, student: 'Grace Nalwanga', class: 'S2-North', time: '07:48 AM', status: 'On Time', sms: 'Sent (Paid)' },
        { id: 103, student: 'John Mugisha', class: 'S6-West', time: '08:15 AM', status: 'Late', sms: 'Sent (Paid)' },
        { id: 104, student: 'Sarah Namukasa', class: 'S3-South', time: '08:22 AM', status: 'Late', sms: 'Failed (No Balance)' },
        { id: 105, student: 'Peter Kato', class: 'S1-East', time: '08:30 AM', status: 'Late', sms: 'Sent (Paid)' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Sidebar (Light Mode) */}
            <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-30 hidden md:flex">
                <div className="h-16 flex items-center px-8 border-b border-slate-100">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">K</div>
                    <span className="font-bold text-slate-800 tracking-tight">Kampala High</span>
                </div>

                <div className="p-4 space-y-2 flex-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium transition-colors">
                        <Users className="w-5 h-5" />
                        Attendance
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl font-medium transition-colors">
                        <MessageSquare className="w-5 h-5" />
                        Communications
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl font-medium transition-colors">
                        <CreditCard className="w-5 h-5" />
                        Billing & SMS
                    </button>
                </div>

                <div className="p-4 border-t border-slate-100">
                    <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="md:ml-64">
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Hello, Principal Sarah</h1>
                        <p className="text-xs text-slate-500">Wednesday, 17th Feb 2026</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 border border-white shadow-sm overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Sarah+Principal&background=random" alt="Profile" />
                        </div>
                    </div>
                </header>

                <main className="p-4 sm:p-8 max-w-6xl mx-auto">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={`p-3 rounded-xl ${stat.color}`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                                        <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                                    </div>
                                </div>
                                <div className="pl-16 text-xs text-slate-400 font-medium">{stat.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Live Entry Feed Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-500" />
                                Live Entry Feed
                            </h2>
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">Export Report</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Student Name</th>
                                        <th className="px-6 py-4">Class</th>
                                        <th className="px-6 py-4">Time In</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">SMS Notification</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {entries.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-800">{entry.student}</td>
                                            <td className="px-6 py-4 text-slate-500">{entry.class}</td>
                                            <td className="px-6 py-4 font-mono text-slate-600">{entry.time}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${entry.status === 'Late' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                    {entry.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 text-xs font-medium">
                                                    {entry.sms.includes('Failed') ? (
                                                        <>
                                                            <AlertCircle className="w-4 h-4 text-red-500" />
                                                            <span className="text-red-500">{entry.sms}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="w-4 h-4 text-blue-500" />
                                                            <span className="text-slate-500">{entry.sms}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SchoolDashboard;
