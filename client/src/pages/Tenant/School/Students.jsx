import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Filter, Loader } from 'lucide-react';
import { fetchTenantUsers } from '../../../services/api';
import { showToast } from '../../../components/GlobalToast';

const SchoolStudents = () => {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const SCHOOL_TENANT_ID = 1; // Seeded Kampala High ID

    useEffect(() => {
        const loadStudents = async () => {
            setIsLoading(true);
            const res = await fetchTenantUsers(SCHOOL_TENANT_ID);
            if (res && res.status === 'success') {
                setStudents(res.data);
            } else {
                showToast('Failed to load active student directory.');
            }
            setIsLoading(false);
        };
        loadStudents();
    }, []);

    const filteredStudents = students.filter(s =>
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(s.id).includes(searchQuery)
    );

    return (
        <div className="font-sans">
            <div className="flex justify-between items-end mb-8 flex-col sm:flex-row gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Directory</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage active school enrolments and parent wallets.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm text-xs">
                        <Filter size={16} />
                        <span>Filter Class</span>
                    </button>
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none w-full sm:w-64 focus:border-blue-500 transition-colors shadow-sm text-xs"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <Loader className="animate-spin text-blue-600 mb-3" size={28} />
                        <p className="text-slate-500 font-bold text-sm">Querying secure student ledger database...</p>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-slate-500 font-bold">No students found matching your search query.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                                <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</th>
                                <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Secure Access Info</th>
                                <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Wallet Balance</th>
                                <th className="p-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="p-6">
                                        <div className="font-bold text-slate-800 text-sm">{student.name}</div>
                                        <div className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">ID: STU-{1000 + student.id}</div>
                                    </td>
                                    <td className="p-6 text-slate-600 font-medium text-xs">{student.email}</td>
                                    <td className="p-6">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                            RFID: {student.rfid || 'Not Assigned'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <span className={`font-bold text-sm ${student.wallet < 2000 ? 'text-red-500 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100' : 'text-slate-800'}`}>
                                            UGX {student.wallet.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SchoolStudents;
