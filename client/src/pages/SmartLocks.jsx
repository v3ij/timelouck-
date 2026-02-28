import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Plus, Battery, Signal, WifiOff, MoreVertical, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

const SmartLocks = () => {
    const navigate = useNavigate();
    const [locks, setLocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMenuId, setActiveMenuId] = useState(null);

    useEffect(() => {
        const fetchLocks = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');
            try {
                const res = await axios.get('/api/dashboard/admin-stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLocks(res.data.devices || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLocks();
    }, [navigate]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to remove this lock?')) {
            setLocks(prev => prev.filter(l => l.id !== id));
            setActiveMenuId(null);
        }
    };

    const toggleMenu = (id) => {
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-[#F4F6F9] font-sans text-slate-800" onClick={() => setActiveMenuId(null)}>
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-bold text-[#0A1F44] flex items-center gap-2">
                            <Lock className="w-5 h-5 text-[#FFA500]" />
                            Smart Locks
                        </h1>
                    </div>
                    <button className="bg-[#0A1F44] hover:bg-[#152a55] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium text-sm transition-colors shadow-lg shadow-blue-900/20">
                        <Plus className="w-4 h-4" />
                        Add New Lock
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="text-center py-12 text-slate-400">Loading devices...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {locks.map((lock) => (
                            <div key={lock.id} className="bg-white rounded-2xl border border-slate-200 overflow-visible shadow-sm hover:shadow-md transition-shadow group relative">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-xl ${lock.online_status ? 'bg-[#1EC677]/10' : 'bg-red-500/10'}`}>
                                            <Lock className={`w-6 h-6 ${lock.online_status ? 'text-[#1EC677]' : 'text-red-500'}`} />
                                        </div>
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleMenu(lock.id);
                                                }}
                                                className="text-slate-300 hover:text-slate-500 p-1 rounded-full hover:bg-slate-100"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {activeMenuId === lock.id && (
                                                <div className="absolute right-0 top-8 w-32 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-fade-in text-left">
                                                    <button className="w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                                        <Edit size={14} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(lock.id)}
                                                        className="w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-[#0A1F44] mb-1">{lock.device_name}</h3>
                                    <p className="text-slate-500 text-sm mb-4">{lock.location}</p>

                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 border-t border-slate-100 pt-4">
                                        <div className="flex items-center gap-1.5">
                                            {lock.online_status ? <Signal className="w-4 h-4 text-[#1EC677]" /> : <WifiOff className="w-4 h-4 text-red-500" />}
                                            <span className={lock.online_status ? 'text-[#1EC677]' : 'text-red-500'}>
                                                {lock.online_status ? 'Online' : 'Offline'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Battery className={`w-4 h-4 ${lock.battery_level < 20 ? 'text-red-500' : 'text-slate-400'}`} />
                                            <span>{lock.battery_level}%</span>
                                        </div>
                                        <div className="ml-auto bg-slate-100 px-2 py-1 rounded-md text-slate-600">
                                            {lock.model}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SmartLocks;
