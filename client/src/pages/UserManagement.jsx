import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MoreVertical, Search, Filter, Edit, Trash2 } from 'lucide-react';

const UserManagement = () => {
    const navigate = useNavigate();
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Dummy Data with African Context
    const [users, setUsers] = useState([
        { id: 1, name: 'Grace Nakato', email: 'grace@example.com', phone: '+256 772 123456', role: 'Admin', status: 'Active' },
        { id: 2, name: 'David Okello', email: 'david@example.com', phone: '+256 701 987654', role: 'User', status: 'Active' },
        { id: 3, name: 'Sarah Namukasa', email: 'sarah@example.com', phone: '+256 753 555888', role: 'User', status: 'Inactive' },
        { id: 4, name: 'John Mugisha', email: 'john@example.com', phone: '+256 789 222333', role: 'Access Manager', status: 'Active' },
    ]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to remove this user?')) {
            setUsers(prev => prev.filter(u => u.id !== id));
            setActiveMenuId(null);
        }
    };

    const toggleMenu = (id) => {
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-[#F4F6F9] font-sans text-slate-800" onClick={() => setActiveMenuId(null)}>
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-bold text-[#0A1F44] flex items-center gap-2">
                            <User className="w-5 h-5 text-[#FFA500]" />
                            User Management
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative min-h-[400px]">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-[#0A1F44]">{user.name}</div>
                                        <div className="text-xs text-slate-400">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{user.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-medium">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-[#1EC677]/10 text-[#1EC677]' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleMenu(user.id);
                                            }}
                                            className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-[#0A1F44]"
                                        >
                                            <MoreVertical size={18} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {activeMenuId === user.id && (
                                            <div className="absolute right-8 top-10 w-32 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-fade-in text-left">
                                                <button className="w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                                    <Edit size={14} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default UserManagement;
