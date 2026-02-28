import React, { useState, useEffect } from 'react';
import { Wallet, Fingerprint, History, Settings, Zap, ArrowDownLeft, ArrowUpRight, Plus, RefreshCw, Power, AlertCircle, Phone, CreditCard, Building, FileText, ScanFace, Nfc, BatteryFull, Wifi, QrCode } from 'lucide-react';
import { fetchWalletBalance, triggerUnlock, fetchUserLogs } from '../../services/api';
import { showToast } from '../../components/GlobalToast';

const UserHome = () => {
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState({ balance: 0, consumption_rate: 50 });
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const [unlockStatus, setUnlockStatus] = useState(null); // 'success' | 'error' | null
    const [showTopUp, setShowTopUp] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // Mocking user profile and activity feed for MVP, since there isn't a dedicated endpoint yet
        // and we have a local session
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            loadWallet(storedUser.id);
        } else {
            // Fallback for demo
            setUser({ id: 999, full_name: 'Test Setup User', email: 'user@test.com' });
            setBalance({ balance: 2500, consumption_rate: 50 });
        }
    }, []);

    const loadWallet = async (userId) => {
        setIsPolling(true);
        const data = await fetchWalletBalance(userId);
        if (data && data.status === 'success') {
            setBalance({ balance: Number(data.wallet.balance_ugx), consumption_rate: 50 }); // Mocking consumption rate
        }

        // Also load logs
        const logsData = await fetchUserLogs(userId);
        if (logsData && logsData.status === 'success') {
            setLogs(logsData.logs);
        }

        setTimeout(() => setIsPolling(false), 800); // Shimmer duration
    };

    useEffect(() => {
        // Implement 10-second polling for live deduction updates
        if (user && user.id) {
            const interval = setInterval(() => {
                loadWallet(user.id);
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleUnlock = async () => {
        if (isUnlocking || balance.balance <= 0) return;
        setIsUnlocking(true);
        setUnlockStatus(null);

        try {
            // Trigger actual API endpoint to simulate 5-second lock protocol
            const response = await triggerUnlock('00:11:22:AA:BB:CC', 'MOCK_RFID_TAG'); // Use mocked device IDs

            if (response.status === 'success' || response.status === 'mock-success') {
                setIsUnlocking(false);
                setUnlockStatus('success');
                // Refresh logs and wallet immediately after unlock
                loadWallet(user.id);
                // Revert success message after 3 seconds
                setTimeout(() => setUnlockStatus(null), 3000);
            } else {
                throw new Error(response.message || 'Unlock Failed');
            }
        } catch (error) {
            setIsUnlocking(false);
            setUnlockStatus('error');
            setTimeout(() => setUnlockStatus(null), 3000);
        }
    };

    // Helper map to convert icon strings from backend to Lucide components
    const getIconComponent = (iconStr) => {
        switch (iconStr) {
            case 'Fingerprint': return Fingerprint;
            case 'Zap': return Zap;
            case 'Plus': return Plus;
            default: return History;
        }
    };

    // Helper to format ISO time relative to now
    const timeAgo = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const now = new Date();
        const seconds = Math.round((now - date) / 1000);
        const minutes = Math.round(seconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);

        if (seconds < 60) return 'Just now';
        if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
        if (days === 1) return 'Yesterday';
        return `${days} days ago`;
    };

    const handleMockPayment = (method) => {
        setIsProcessingPayment(true);
        setTimeout(() => {
            setIsProcessingPayment(false);
            setShowTopUp(false);
            showToast(`Successfully mocked ${method} Top-up!`);
            loadWallet(user?.id); // Refresh after top-up
        }, 1500);
    };

    const handleDownloadReceipt = (e, logObj) => {
        e.stopPropagation();
        showToast(`Generating PDF Receipt for: ${logObj.title}...`);
        setTimeout(() => window.print(), 800);
    };

    return (
        <div className="min-h-screen bg-[#0A1F44] text-slate-200 font-sans pb-24 selection:bg-blue-500/30">

            {/* Header / Profile */}
            <div className="pt-10 pb-6 px-6 flex justify-between items-center z-10 relative">
                <div>
                    <p className="text-slate-400 text-sm font-medium">Welcome back,</p>
                    <h1 className="text-2xl font-bold text-white">{user?.full_name || 'User'}</h1>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border-2 border-slate-800">
                    <span className="font-bold">{user?.full_name?.charAt(0) || 'U'}</span>
                </div>
            </div>

            <div className="px-6 space-y-6">

                {/* Digital Identity & Access (CARIBOU Requirement) */}
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Digital Identity & Access</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-800 rounded-2xl p-3 border border-white/5 shadow-md flex flex-col items-center text-center group">
                            <div className="bg-blue-500/20 text-blue-400 p-2 rounded-xl mb-2 group-hover:scale-110 transition-transform">
                                <ScanFace size={20} />
                            </div>
                            <h4 className="text-[11px] font-bold text-white mb-1">Face</h4>
                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded-full">Enrolled</span>
                        </div>
                        <div className="bg-slate-800 rounded-2xl p-3 border border-white/5 shadow-md flex flex-col items-center text-center group">
                            <div className="bg-blue-500/20 text-blue-400 p-2 rounded-xl mb-2 group-hover:scale-110 transition-transform">
                                <Fingerprint size={20} />
                            </div>
                            <h4 className="text-[11px] font-bold text-white mb-1">Print</h4>
                            <span className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-1.5 py-0.5 rounded-full">Pending</span>
                        </div>
                        <div className="bg-slate-800 rounded-2xl p-3 border border-white/5 shadow-md flex flex-col items-center text-center group">
                            <div className="bg-purple-500/20 text-purple-400 p-2 rounded-xl mb-2 group-hover:scale-110 transition-transform">
                                <Nfc size={20} />
                            </div>
                            <h4 className="text-[11px] font-bold text-white mb-1">Card</h4>
                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded-full">Linked</span>
                        </div>
                    </div>
                </div>

                {/* Hardware Assignment & Status */}
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-[10px] text-slate-400 mb-0.5 uppercase font-bold tracking-wider">Assigned Door</p>
                        <p className="text-sm font-bold text-white">Room 204 - Timmy TL90</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                            <Wifi size={14} /> Online
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                            <BatteryFull size={14} className="text-emerald-400" /> 85% <span className="text-[10px] text-slate-500">(5000mAh)</span>
                        </div>
                    </div>
                </div>

                {/* Low Balance Warning Banner */}
                {balance.balance < 500 && (
                    <div className="bg-gradient-to-r from-red-500/20 to-orange-500/10 border border-red-500/50 rounded-2xl p-4 flex items-start gap-3 animate-pulse">
                        <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="text-red-400 font-bold text-sm">Low Balance Warning</h4>
                            <p className="text-red-300 text-xs mt-1">Your wallet is below 500 UGX. Please top up to avoid immediate access restriction.</p>
                        </div>
                    </div>
                )}

                {/* The Time Wallet Card (Core Feature) */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700"></div>

                    <div className="flex flex-wrap gap-4 justify-between items-start mb-6">
                        <div className="flex flex-col gap-1 min-w-[50%]">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Wallet size={20} className="text-blue-400" />
                                </div>
                                <span className="text-sm font-semibold text-slate-300 tracking-wide uppercase">Time Wallet</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live Sync</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-emerald-400">{balance.consumption_rate} UGX / Hr</span>
                        </div>
                    </div>

                    <div className="mb-2">
                        <p className="text-slate-400 text-sm mb-1">Available Balance</p>
                        <div className="flex flex-wrap items-baseline gap-2">
                            <h2 className={`text-4xl md:text-5xl font-black tracking-tight transition-all duration-300 ${isPolling ? 'text-white blur-[1px] scale-[0.98]' : 'text-white'}`}>
                                {Number(balance.balance).toLocaleString()}
                            </h2>
                            <span className="text-xl font-bold text-blue-400">UGX</span>
                        </div>
                        <p className="text-xs text-blue-400/90 mt-2 font-bold bg-blue-500/10 inline-block px-2.5 py-1 rounded border border-blue-500/20">Active Rate: Hourly Deduction</p>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={() => setShowTopUp(true)}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <ArrowDownLeft size={18} /> Top-Up
                        </button>
                        <button
                            onClick={() => showToast('Module Ready for Future Integration: Detailed History View')}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-slate-900/50 transition-all active:scale-95 flex items-center justify-center gap-2 border border-slate-600"
                        >
                            <History size={18} /> History
                        </button>
                    </div>
                </div>



                {/* Smart Lock Control */}
                <div>
                    <div className="flex justify-between items-end mb-4 px-1">
                        <h3 className="text-lg font-bold text-white">Smart Lock</h3>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Connected</span>
                        </div>
                    </div>

                    <div className="bg-slate-800 rounded-3xl p-6 border border-white/5 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
                        {/* Status Background Glow */}
                        {isUnlocking && <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>}
                        {unlockStatus === 'success' && <div className="absolute inset-0 bg-emerald-500/5"></div>}

                        <p className="text-white font-bold text-lg mb-1 z-10">Unlock via Wi-Fi/Bluetooth</p>
                        <p className="text-xs text-slate-400 mb-8 z-10 font-medium">Works offline via RFID card</p>

                        <button
                            onPointerDown={handleUnlock}
                            disabled={isUnlocking}
                            className={`
                                relative flex items-center justify-center w-36 h-36 rounded-full shadow-2xl z-10 transition-all duration-300
                                ${isUnlocking
                                    ? 'bg-slate-700 scale-95 shadow-inner'
                                    : unlockStatus === 'success'
                                        ? 'bg-emerald-500 scale-100 shadow-emerald-500/50'
                                        : 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:scale-105 shadow-blue-500/40 active:scale-95'
                                }
                            `}
                        >
                            {/* Ripple Effect ring */}
                            {isUnlocking && (
                                <>
                                    <div className="absolute inset-0 rounded-full border border-blue-400 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                                    <div className="absolute inset-0 rounded-full border border-blue-400 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] delay-300"></div>
                                </>
                            )}

                            <Power size={48} className={`relative z-10 transition-colors duration-300 ${isUnlocking ? 'text-blue-400 animate-pulse' : 'text-white'}`} strokeWidth={2.5} />
                        </button>

                        <div className="mt-6 z-10 h-6">
                            {isUnlocking ? (
                                <span className="text-blue-400 font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                                    <RefreshCw size={14} className="animate-spin" /> Unlocking...
                                </span>
                            ) : unlockStatus === 'success' ? (
                                <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm">
                                    Door Unlocked
                                </span>
                            ) : (
                                <span className="text-slate-400 font-semibold tracking-widest uppercase text-sm">
                                    Press to Unlock
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Live Activity Feed */}
                <div>
                    <div className="flex justify-between items-end mb-4 px-1">
                        <h3 className="text-lg font-bold text-white">Live Activity</h3>
                        <button
                            onClick={() => showToast('Module Ready for API Binding: View All Activity')}
                            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            View All
                        </button>
                    </div>

                    <div className="bg-slate-800 rounded-3xl p-3 border border-white/5 shadow-xl space-y-1">
                        {logs.length === 0 ? (
                            <p className="text-center text-slate-500 py-6 font-medium text-sm">No recent activity detected.</p>
                        ) : (
                            logs.map((log) => {
                                const Icon = getIconComponent(log.iconStr);
                                return (
                                    <div key={log.id} className="flex items-center gap-3 md:gap-4 p-3 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group">
                                        <div className={`p-2 md:p-3 shrink-0 rounded-xl ${log.bg} ${log.color} transition-transform group-hover:scale-110`}>
                                            <Icon size={20} className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-200 text-sm md:text-base truncate">
                                                {log.type === 'unlock' ? 'Access Granted' : log.type === 'deduction' ? 'Wallet Deduction' : log.title}
                                            </h4>
                                            <p className="text-[10px] md:text-xs text-slate-500 truncate">
                                                {log.type === 'unlock' ? 'Timestamp recorded upon entry' : log.subtitle}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0 flex flex-col items-end gap-1">
                                            {log.amount && (
                                                <p className={`font-bold text-xs md:text-sm whitespace-nowrap ${log.type === 'deduction' ? 'text-slate-200' : 'text-emerald-400'}`}>
                                                    {log.amount}
                                                </p>
                                            )}
                                            <p className="text-[10px] md:text-xs text-slate-500 font-medium whitespace-nowrap">{timeAgo(log.time)}</p>

                                            {/* Receipt Download Hook */}
                                            {(log.type === 'deduction' || log.type === 'topup') && (
                                                <button
                                                    onClick={(e) => handleDownloadReceipt(e, log)}
                                                    className="mt-1 p-1 bg-white/5 hover:bg-blue-500/20 text-blue-400 rounded-md transition-colors group-hover:opacity-100 opacity-0 md:opacity-100"
                                                    title="Download Receipt"
                                                >
                                                    <FileText size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>

            {/* Bottom Navigation Mockup */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#0A1F44]/90 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex justify-between items-center z-50 pb-safe">
                <button className="flex flex-col items-center gap-1 text-blue-500 transition-colors">
                    <Wallet size={24} />
                    <span className="text-[10px] font-bold tracking-wide">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
                    <History size={24} />
                    <span className="text-[10px] font-bold tracking-wide">Activity</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
                    <Settings size={24} />
                    <span className="text-[10px] font-bold tracking-wide">Settings</span>
                </button>
            </div>

            {/* Advanced Top-Up Modal Overlay */}
            {showTopUp && (
                <div className="fixed inset-0 bg-[#0A1F44]/80 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
                    <div className="bg-slate-800 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/10 animate-slide-up">
                        <div className="p-6 border-b border-white/5">
                            <h3 className="text-xl font-bold text-white mb-1">Fund Your Wallet</h3>
                            <p className="text-sm text-slate-400">Select a payment method</p>
                        </div>

                        <div className="p-4 space-y-3 bg-slate-800/50">
                            {/* Option 1: Mobile Money */}
                            <button
                                onClick={() => handleMockPayment('Mobile Money')}
                                disabled={isProcessingPayment}
                                className="w-full flex items-center justify-between p-4 bg-slate-700/50 hover:bg-slate-700 border border-white/5 rounded-2xl transition-all group disabled:opacity-50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-500 flex items-center justify-center">
                                        <Phone size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-white text-sm">Mobile Money</p>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-0.5">MTN / Airtel / M-PESA</p>
                                    </div>
                                </div>
                                <ArrowUpRight className="text-slate-500 group-hover:text-blue-400 transition-colors" size={20} />
                            </button>

                            {/* Option 2: Bank Card */}
                            <button
                                onClick={() => handleMockPayment('Bank Card')}
                                disabled={isProcessingPayment}
                                className="w-full flex items-center justify-between p-4 bg-slate-700/50 hover:bg-slate-700 border border-white/5 rounded-2xl transition-all group disabled:opacity-50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                        <CreditCard size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-white text-sm">Bank Card</p>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-0.5">Interswitch / Flutterwave / Paystack</p>
                                    </div>
                                </div>
                                <ArrowUpRight className="text-slate-500 group-hover:text-blue-400 transition-colors" size={20} />
                            </button>

                            {/* Option 3: Top-up Kiosk */}
                            <button
                                onClick={() => handleMockPayment('Campus Kiosk')}
                                disabled={isProcessingPayment}
                                className="w-full flex items-center justify-between p-4 bg-slate-700/50 hover:bg-slate-700 border border-white/5 rounded-2xl transition-all group disabled:opacity-50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                        <QrCode size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-white text-sm">ATM Kiosk Recharge</p>
                                        <p className="text-[10px] text-emerald-400/80 uppercase tracking-wider font-bold mt-0.5">Scan Kiosk QR Code</p>
                                    </div>
                                </div>
                                <ArrowUpRight className="text-slate-500 group-hover:text-blue-400 transition-colors" size={20} />
                            </button>
                        </div>

                        <div className="p-4 grid grid-cols-2 gap-3 mt-2 bg-slate-800 border-t border-white/5">
                            {isProcessingPayment ? (
                                <div className="col-span-2 py-3 flex justify-center items-center gap-2 text-blue-400 font-bold">
                                    <RefreshCw size={18} className="animate-spin" /> Processing Payment...
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setShowTopUp(false)}
                                        className="py-3.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <div className="py-3.5 bg-[#081835] border border-[#0A1F44] text-slate-500 rounded-xl font-bold text-center text-sm flex items-center justify-center">
                                        Secured by Cortex
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserHome;
