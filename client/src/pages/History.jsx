import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Lock, Clock, CreditCard } from 'lucide-react';

const History = () => {
    const navigate = useNavigate();
    const [historyItems, setHistoryItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await axios.get('/api/wallet/transactions', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistoryItems(res.data.transactions);
            } catch (err) {
                console.error("Failed to load history:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-black/90 flex items-center justify-center p-4 font-sans tap-highlight-transparent">
            <div className="w-full max-w-[375px] h-[812px] bg-[#0A1F44] relative rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-gray-800 ring-4 ring-gray-900 animate-scale-in">

                {/* Header */}
                <div className="p-6 pt-12 flex items-center space-x-4 text-white z-10 relative">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/10 rounded-full transition">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold">Activity Log</h1>
                </div>

                {/* List */}
                <div className="px-6 space-y-4 overflow-y-auto h-[85%] pb-24 custom-scrollbar">
                    {isLoading ? (
                        <div className="space-y-4 mt-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white/5 rounded-2xl p-4 flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full skeleton"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-24 rounded skeleton"></div>
                                        <div className="h-3 w-32 rounded skeleton"></div>
                                    </div>
                                    <div className="h-4 w-12 rounded skeleton"></div>
                                </div>
                            ))}
                        </div>
                    ) : historyItems.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10">No recent activity</div>
                    ) : (
                        historyItems.map((item) => (
                            <div key={item.id} className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex items-center space-x-4 shadow-lg animate-fade-in-up">
                                <div className={`p-3 rounded-full ${item.type === 'UNLOCK' ? 'bg-[#1EC677]/10 text-[#1EC677]' :
                                    item.type === 'TOPUP' ? 'bg-[#FFA500]/10 text-[#FFA500]' : 'bg-blue-500/10 text-blue-400'
                                    }`}>
                                    {item.type === 'UNLOCK' ? <Lock className="w-5 h-5" /> :
                                        item.type === 'TOPUP' ? <CreditCard className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-bold text-sm">
                                        {item.type === 'UNLOCK' ? 'Door Access' : item.type === 'TOPUP' ? 'Wallet Top Up' : item.type}
                                    </h3>
                                    <p className="text-gray-400 text-xs">{item.description || 'System Activity'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-bold text-xs">
                                        {item.amount ? `+${parseFloat(item.amount).toLocaleString()}` : ''}
                                    </p>
                                    <p className="text-gray-500 text-[10px]">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;
