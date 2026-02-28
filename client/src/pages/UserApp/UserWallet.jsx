import React from 'react';
import { ArrowLeft, Send, Plus, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserWallet = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={18} />
                Back to Home
            </button>

            {/* Balance Card */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 rounded-3xl shadow-lg shadow-emerald-900/20 text-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <p className="text-emerald-100 text-sm mb-2 uppercase tracking-widest font-bold">Total Balance</p>
                <h1 className="text-4xl font-bold text-white">UGX 17,500</h1>
                <p className="text-emerald-200 text-xs mt-2">+UGX 5,000 this week</p>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-8 py-4">
                <div className="flex flex-col items-center gap-2">
                    <button className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center text-emerald-400 hover:bg-slate-700 transition border border-white/10 shadow-lg">
                        <Plus size={24} />
                    </button>
                    <span className="text-xs text-slate-400 font-medium">Top Up</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <button className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center text-blue-400 hover:bg-slate-700 transition border border-white/10 shadow-lg">
                        <Send size={24} />
                    </button>
                    <span className="text-xs text-slate-400 font-medium">Send</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <button className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center text-purple-400 hover:bg-slate-700 transition border border-white/10 shadow-lg">
                        <CreditCard size={24} />
                    </button>
                    <span className="text-xs text-slate-400 font-medium">Cards</span>
                </div>
            </div>

            {/* Transactions */}
            <div>
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 ml-2">Recent Transactions</h3>
                <div className="space-y-3">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-slate-800 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                                    <span className="text-lg">🍔</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-200">Cafeteria</h4>
                                    <p className="text-xs text-slate-500">Today, 12:45 PM</p>
                                </div>
                            </div>
                            <span className="font-bold text-red-400">- UGX 3,500</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserWallet;
