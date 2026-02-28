import React from 'react';
import { mock } from '../../../data/mock';

const SchoolAttendance = () => {
    const { logs } = mock;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Attendance Logs</h1>
                <p className="text-slate-500 text-sm mt-1">Real-time entry and exit tracking.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                            <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                            <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Location/Action</th>
                            <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-6 font-mono text-slate-600 text-sm">{log.time}</td>
                                <td className="p-6 font-bold text-slate-800">{log.user}</td>
                                <td className="p-6 text-slate-600 font-medium">{log.action}</td>
                                <td className="p-6">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${log.status === 'Success'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                            : 'bg-red-50 text-red-700 border-red-100'
                                        }`}>
                                        {log.status === 'Success' ? 'Granted' : 'Denied'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SchoolAttendance;
