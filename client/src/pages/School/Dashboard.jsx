import React from 'react';
import { Users, Clock, AlertCircle, MessageSquare, Calendar } from 'lucide-react';
import { mockData } from '../../data/mockData';

const SchoolDashboard = () => {
    const { students, smsLogs } = mockData;

    // Calculate Real Stats
    const totalStudents = students.length;
    const presentCount = students.filter(s => s.status === 'Present').length;
    const attendanceRate = Math.round((presentCount / totalStudents) * 100);
    const lateCount = students.filter(s => s.status === 'Late').length;

    const stats = [
        { label: 'Total Students', value: totalStudents, sub: 'Active Enrolment', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: "Today's Attendance", value: `${attendanceRate}%`, sub: `${presentCount} Present`, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Late Arrivals', value: lateCount, sub: 'Requires Attention', icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'SMS Sent', value: smsLogs.length, sub: 'Last 24 Hours', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="p-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">School Dashboard</h1>
                    <p className="text-slate-500">Kampala High School • Term 1 2026</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 shadow-sm">
                        Download Report
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">
                        + New Student
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                            <p className="text-xs text-slate-400 mt-2">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Visuals */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-80 flex items-center justify-center text-slate-400">
                [Weekly Attendance Trend Chart Placeholder - Implement Recharts here for V2]
            </div>
        </div>
    );
};

export default SchoolDashboard;
