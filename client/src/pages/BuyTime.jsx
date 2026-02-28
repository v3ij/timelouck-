import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Clock, CreditCard, Check, AlertTriangle, X } from 'lucide-react';

const BuyTime = () => {
    const navigate = useNavigate();
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ type: null, message: '', title: '' });

    const packages = [
        { id: 1, duration: '30 Mins', minutes: 30, price: 1.00, label: 'Quick Access' },
        { id: 2, duration: '1 Hour', minutes: 60, price: 2.00, label: 'Standard' },
        { id: 3, duration: 'Full Day', minutes: 1440, price: 10.00, label: 'Best Value', recommended: true },
    ];

    const handlePurchase = async () => {
        if (!selectedPackage) return;
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            await axios.post('/api/wallet/pay', {
                amount: selectedPackage.price,
                description: `Access: ${selectedPackage.duration}`,
                durationMinutes: selectedPackage.minutes
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setModal({ type: 'success', title: 'Payment Successful', message: 'Your access time has been extended.' });

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (err) {
            console.error(err);
            setModal({
                type: 'error',
                title: 'Payment Failed',
                message: err.response?.data?.message || 'Insufficient funds or network error.'
            });
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => setModal({ type: null, message: '', title: '' });

    return (
        <div className="min-h-screen bg-black/90 flex items-center justify-center p-4 font-sans tap-highlight-transparent">
            {/* Modal Overlay */}
            {modal.type && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className={`w-full max-w-sm bg-[#0A1F44] border-2 rounded-3xl p-6 shadow-2xl transform transition-all scale-100 ${modal.type === 'error' ? 'border-red-500' : 'border-[#1EC677]'
                        }`}>
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className={`p-4 rounded-full ${modal.type === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-[#1EC677]/20 text-[#1EC677]'
                                }`}>
                                {modal.type === 'error' ? <AlertTriangle size={32} /> : <Check size={32} strokeWidth={3} />}
                            </div>

                            <div>
                                <h3 className={`text-xl font-bold mb-2 ${modal.type === 'error' ? 'text-white' : 'text-white'
                                    }`}>
                                    {modal.title}
                                </h3>
                                <p className="text-blue-200/70 text-sm">
                                    {modal.message}
                                </p>
                            </div>

                            <button
                                onClick={closeModal}
                                className={`w-full py-3 rounded-xl font-bold text-[#0A1F44] transition-transform active:scale-95 ${modal.type === 'error' ? 'bg-red-500 hover:bg-red-400' : 'bg-[#1EC677] hover:bg-[#19b86b]'
                                    }`}
                            >
                                {modal.type === 'error' ? 'Dismiss' : 'Continue'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-[375px] h-[812px] bg-[#0A1F44] relative rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-gray-800 ring-4 ring-gray-900 animate-scale-in">

                {/* Header */}
                <div className="p-6 pt-12 flex items-center space-x-4 text-white z-10 relative">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/10 rounded-full transition">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold">Buy Time</h1>
                </div>

                <div className="px-6 mt-4">
                    <p className="text-blue-200/70 text-sm mb-6">Select a time package to extend your access.</p>

                    <div className="grid grid-cols-2 gap-4">
                        {packages.map((pkg) => (
                            <button
                                key={pkg.id}
                                onClick={() => setSelectedPackage(pkg)}
                                className={`relative p-4 rounded-3xl border transition-all duration-200 flex flex-col items-center justify-center text-center group aspect-square ${selectedPackage?.id === pkg.id
                                    ? 'bg-[#1EC677]/10 border-[#1EC677] shadow-[0_0_20px_rgba(30,198,119,0.2)]'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                                    }`}
                            >
                                {pkg.recommended && (
                                    <span className="absolute -top-3 bg-[#1EC677] text-[#0A1F44] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        Best Value
                                    </span>
                                )}

                                <div className={`p-3 rounded-full mb-3 transition-colors ${selectedPackage?.id === pkg.id ? 'bg-[#1EC677] text-[#0A1F44]' : 'bg-white/5 text-gray-400'
                                    }`}>
                                    <Clock className="w-6 h-6" />
                                </div>

                                <h3 className={`font-bold text-lg mb-1 ${selectedPackage?.id === pkg.id ? 'text-white' : 'text-gray-300'}`}>
                                    {pkg.duration}
                                </h3>

                                <p className={`font-bold text-sm ${selectedPackage?.id === pkg.id ? 'text-[#1EC677]' : 'text-white/60'}`}>
                                    {pkg.price.toLocaleString()} UGX
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-10 left-0 w-full px-6">
                    <button
                        onClick={handlePurchase}
                        disabled={!selectedPackage || loading}
                        className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center space-x-2 transition-all ${!selectedPackage
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-[#1EC677] text-[#0A1F44] hover:shadow-[#1EC677]/20 active:scale-[0.98]'
                            }`}
                    >
                        {loading ? (
                            <span>Processing...</span>
                        ) : (
                            <>
                                <CreditCard className="w-5 h-5" />
                                <span>{selectedPackage ? `Pay UGX ${selectedPackage.price.toLocaleString()}` : 'Select Package'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BuyTime;
