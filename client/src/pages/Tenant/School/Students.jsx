import React from 'react';
import { Search, MoreVertical, Filter } from 'lucide-react';
import { mock } from '../../../data/mock';

const SchoolStudents = () => {
    const students = mock.users.filter(u => u.role === 'Student');

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Student Directory</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage enrolment and wallet balances.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input type="text" placeholder="Search students..." className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none w-64 focus:border-blue-500 transition-colors" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                            <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</th>
                            <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Access Info</th>
                            <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Wallet Balance</th>
                            <th className="p-6"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="p-6">
                                    <div className="font-bold text-slate-800">{student.name}</div>
                                    <div className="text-xs text-slate-400 mt-0.5">{student.id}</div>
                                </td>
                                <td className="p-6 text-slate-600 font-medium">{student.email}</td>
                                <td className="p-6">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        {student.accessLevel || 'Standard'}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <span className="font-bold text-slate-800">UGX {student.wallet.toLocaleString()}</span>
                                </td>
                                <td className="p-6 text-right">
                                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SchoolStudents;
