import React from 'react';
import { mockData } from '../../data/mockData';

const SchoolAttendance = () => {
    const { students } = mockData;
    // Filter only those who have access logs
    const activeLogs = students.filter(s => s.lastAccess !== '-');

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Daily Attendance Log</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-6">Time</th>
                            <th className="p-6">Student</th>
                            <th className="p-6">Event</th>
                            <th className="p-6">Gate</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {activeLogs.map((student, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                                <td className="p-6 font-mono text-slate-600 font-medium">{student.lastAccess}</td>
                                <td className="p-6 font-bold text-slate-800">{student.name}</td>
                                <td className="p-6">
                                    <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold">Checked In</span>
                                </td>
                                <td className="p-6 text-slate-500">Main Gate</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SchoolAttendance;
