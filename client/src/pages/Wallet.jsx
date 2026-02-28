import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon } from 'lucide-react';

const Wallet = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWalletData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // Fetch Balance
                const balRes = await axios.get('/api/wallet/balance', { headers: { Authorization: `Bearer ${token}` } });
                setBalance(balRes.data.balance);

                // Fetch Transactions
                const transRes = await axios.get('/api/wallet/transactions', { headers: { Authorization: `Bearer ${token}` } });
                setTransactions(transRes.data.transactions);
            } catch (err) {
                console.error("Failed to load wallet data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWalletData();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-black/90 flex items-center justify-center p-4 font-sans tap-highlight-transparent">
            <div className="w-full max-w-[375px] h-[812px] bg-[#0A1F44] relative rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-gray-800 ring-4 ring-gray-900 animate-scale-in">

                {/* Header */}
                <div className="p-6 pt-12 flex items-center space-x-4 text-white z-10 relative">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/10 rounded-full transition">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold">My Wallet</h1>
                </div>

                {/* Balance & Card */}
                <div className="px-6 mb-6">
                    <div className="bg-gradient-to-br from-[#1EC677] to-[#159c5d] rounded-[28px] p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <WalletIcon className="w-20 h-20 transform rotate-[-20deg]" />
                        </div>
                        <p className="text-white/80 text-sm font-medium mb-1">Available Balance</p>
                        <h2 className="text-3xl font-bold tracking-tight">UGX {parseFloat(balance).toLocaleString()}</h2>
                    </div>
                </div>

                {/* List Title */}
                <div className="px-6 mb-3">
                    <h3 className="text-white text-md font-bold">Transactions</h3>
                </div>

                {/* List */}
                <div className="px-6 space-y-3 overflow-y-auto h-[60%] pb-24 custom-scrollbar">
                    {isLoading ? (
                        <div className="text-center text-gray-400 mt-10">Loading...</div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10">No transactions found</div>
                    ) : (
                        transactions.map((t) => (
                            <div key={t.id} className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2.5 rounded-full ${t.type === 'TOPUP' ? 'bg-[#1EC677]/10 text-[#1EC677]' : 'bg-white/10 text-white'
                                        }`}>
                                        {t.type === 'TOPUP' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">
                                            {t.type === 'TOPUP' ? 'Wallet Top Up' : 'Payment'}
                                        </p>
                                        <p className="text-gray-400 text-xs">{new Date(t.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold text-sm ${t.type === 'TOPUP' ? 'text-[#1EC677]' : 'text-white'}`}>
                                        {t.type === 'TOPUP' ? '+' : '-'} {parseFloat(t.amount).toLocaleString()}
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

export default Wallet;
