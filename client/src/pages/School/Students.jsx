import React from 'react';
import { Search, Filter, MoreVertical } from 'lucide-react';
import { mock } from '../../data/mock';

const SchoolStudents = () => {
    const students = mock.users.filter(u => u.role === 'Student');

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Student Directory</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input type="text" placeholder="Search students..." className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64" />
                    </div>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="p-6">Student Info</th>
                            <th className="p-6">Grade</th>
                            <th className="p-6">Status</th>
                            <th className="p-6">Parent Phone</th>
                            <th className="p-6">Wallet Balance</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-6">
                                    <div>
                                        <p className="font-bold text-slate-800">{student.name}</p>
                                        <p className="text-xs text-slate-400">{student.id}</p>
                                    </div>
                                </td>
                                <td className="p-6 text-slate-600 font-medium">{student.grade}</td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.status === 'Present' ? 'bg-emerald-100 text-emerald-600' :
                                        student.status === 'Late' ? 'bg-orange-100 text-orange-600' :
                                            'bg-red-100 text-red-600'
                                        }`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="p-6 text-slate-600 font-mono text-sm">{student.parentPhone}</td>
                                <td className="p-6 font-bold text-slate-700">
                                    UGX {student.wallet.toLocaleString()}
                                </td>
                                <td className="p-6 text-right">
                                    <button className="text-slate-400 hover:text-blue-600">
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
