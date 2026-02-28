import { useState } from 'react';
import axios from 'axios';
import { X, CreditCard, Smartphone, Check } from 'lucide-react';

const TopUpModal = ({ isOpen, onClose, onSuccess }) => {
    const [amount, setAmount] = useState(null);
    const [method, setMethod] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleTopUp = async () => {
        if (!amount || !method) return;
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            // Real API Call
            await axios.post('/api/wallet/topup',
                { amount, method },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // On success, we just update the UI
            onSuccess(amount);
            onClose();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Payment failed');
        } finally {
            setIsLoading(false);
        }
    };

    const options = [
        { value: 5000, label: '1 Hour', price: '5,000 UGX' },
        { value: 20000, label: '5 Hours', price: '20,000 UGX' },
        { value: 50000, label: '24 Hours', price: '50,000 UGX' },
    ];

    return (
        <div className="absolute inset-0 z-50 flex items-end justify-center sm:items-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative bg-[#0A1F44] w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-white/10 animate-fade-in-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/5 rounded-full text-gray-400 hover:text-white"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-white mb-1">Top Up Wallet</h2>
                <p className="text-blue-200/60 text-sm mb-6">Select a package to extend access.</p>

                <div className="space-y-3 mb-6">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setAmount(opt.value)}
                            className={`w-full p-4 rounded-2xl border flex justify-between items-center transition-all ${amount === opt.value
                                ? 'bg-[#1EC677]/10 border-[#1EC677] text-white'
                                : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                                }`}
                        >
                            <span className="font-semibold">{opt.label}</span>
                            <span className={`${amount === opt.value ? 'text-[#1EC677]' : 'text-gray-400'}`}>{opt.price}</span>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                        onClick={() => setMethod('card')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${method === 'card' ? 'bg-white/10 border-white text-white' : 'bg-white/5 border-white/5 text-gray-400'
                            }`}
                    >
                        <CreditCard size={24} />
                        <span className="text-xs font-medium">Card</span>
                    </button>
                    <button
                        onClick={() => setMethod('mobile')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${method === 'mobile' ? 'bg-white/10 border-white text-white' : 'bg-white/5 border-white/5 text-gray-400'
                            }`}
                    >
                        <Smartphone size={24} />
                        <span className="text-xs font-medium">Mobile Money</span>
                    </button>
                </div>

                <button
                    onClick={handleTopUp}
                    disabled={!amount || !method || isLoading}
                    className="w-full bg-[#FFA500] hover:bg-[#e69500] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Processing...' : 'Pay Now'}
                </button>
            </div>
        </div>
    );
};

export default TopUpModal;
