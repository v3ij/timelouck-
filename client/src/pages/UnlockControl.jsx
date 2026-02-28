import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Lock, Unlock, AlertTriangle, CheckCircle, X } from 'lucide-react';

const UnlockControl = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('LOCKED'); // LOCKED, UNLOCKING, UNLOCKED
    const [timeLeft, setTimeLeft] = useState(0);
    const [modal, setModal] = useState({ type: null, message: '', title: '' }); // type: 'success' | 'error' | null

    const handleUnlock = async () => {
        if (status !== 'LOCKED') return;

        const UNLOCK_COST = 5.00;

        // Semantic simple confirm - could be upgraded to modal later
        if (!window.confirm(`Unlock Door? Fee: ${UNLOCK_COST} units`)) return;

        setStatus('UNLOCKING'); // Shows "CONNECTING..."

        // Check if user has enough balance (Mock check)
        // In real app, api.wallet.pay() would handle this check on backend

        try {
            setStatus('UNLOCKING');

            // Simulate "Connecting..." delay for realism (2 seconds)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Call API
            // Note: In axios, 4xx/5xx responses throw an error, caught in catch block.
            // If backend returns 200 with { success: false }, we handle it here.
            const response = await api.locks.unlock(1, UNLOCK_COST);

            // Strict Logic as requested
            if (response.data?.success !== false) {
                setStatus('UNLOCKED');
                setTimeLeft(10); // 10 seconds to open
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Door Unlocked',
                    message: 'You have 10 seconds to enter.'
                });

                // Auto-lock countdown
                const timer = setInterval(() => {
                    setTimeLeft((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            setStatus('LOCKED');
                            setModal({ type: null, message: '', title: '' }); // Clear modal on lock
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                // If backend says success: false
                throw new Error(response.data?.message || 'Device refused connection');
            }

        } catch (err) {
            console.error(err);
            setStatus('LOCKED');
            setModal({
                show: true,
                type: 'error', // RED Modal
                title: 'Connection Failed',
                message: err.response?.data?.message || 'Device Offline or Busy. Please try again.'
            });
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
                                {modal.type === 'error' ? <AlertTriangle size={32} /> : <CheckCircle size={32} />}
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
                                {modal.type === 'error' ? 'Try Again' : 'Awesome'}
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
                    <h1 className="text-xl font-bold">Door Control</h1>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center pt-10 pb-20">

                    {/* Status Text */}
                    <div className="mb-10 text-center">
                        <p className="text-blue-200/50 uppercase tracking-widest text-xs font-bold mb-2">Current Status</p>
                        <h2 className={`text-3xl font-bold tracking-tight ${status === 'UNLOCKED' ? 'text-[#1EC677]' : 'text-white'}`}>
                            {status === 'UNLOCKING' ? 'CONNECTING...' : status}
                        </h2>
                    </div>

                    {/* Big Button */}
                    <button
                        onClick={handleUnlock}
                        disabled={status !== 'LOCKED'}
                        className={`w-64 h-64 rounded-full border-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center transition-all duration-500 relative group ${status === 'UNLOCKED'
                            ? 'bg-[#1EC677]/20 border-[#1EC677] scale-105'
                            : status === 'UNLOCKING'
                                ? 'bg-blue-500/20 border-blue-500 animate-pulse'
                                : 'bg-[#0A1F44] border-white/10 active:scale-95 hover:border-white/30'
                            }`}
                    >
                        {status === 'UNLOCKED' && (
                            <div className="absolute inset-0 bg-[#1EC677]/20 rounded-full animate-ping-slow"></div>
                        )}

                        <div className={`p-6 rounded-full mb-4 transition-colors duration-500 ${status === 'UNLOCKED' ? 'bg-[#1EC677] text-[#0A1F44]' : 'bg-white/10 text-white'
                            }`}>
                            {status === 'UNLOCKED' ? <Unlock className="w-12 h-12" /> : <Lock className="w-12 h-12" />}
                        </div>

                        {status === 'UNLOCKED' ? (
                            <div className="text-center">
                                <span className="text-4xl font-bold text-white tabular-nums">{timeLeft}</span>
                                <span className="block text-[#1EC677] text-xs font-bold uppercase mt-1">Seconds Left</span>
                            </div>
                        ) : (
                            <span className="text-white/60 text-sm font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                                {status === 'UNLOCKING' ? 'Verifying...' : 'Tap to Unlock'}
                            </span>
                        )}
                    </button>

                    <p className="text-white/30 text-xs mt-12 px-10 text-center">
                        Secure connection established via Encrypted Bluetooth/Wi-Fi Bridge.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UnlockControl;
