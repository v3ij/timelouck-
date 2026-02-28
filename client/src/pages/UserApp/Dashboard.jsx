import React, { useState, useEffect } from 'react';
import { fetchWalletBalance, triggerUnlock, simulateTopUp } from '../../services/api';

// Reusable SVGs for the comprehensive mobile app
const UserAvatar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
    </svg>
);

const FingerprintIcon = ({ size = 'h-10 w-10' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${size}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
    </svg>
);

const FaceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const QRIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#10B981]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#EF4444]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const ReceiptIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const NavHomeIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-white' : 'text-gray-500'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const NavWalletIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-white' : 'text-gray-500'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const NavKeyIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-white' : 'text-gray-500'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
);

const NavSettingsIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-white' : 'text-gray-500'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const DeductIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
);

const TopupAlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const UnlockLogIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0A1F44]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
    </svg>
);

const UserDashboard = () => {
    const [isTapped, setIsTapped] = useState(false);
    const [filter, setFilter] = useState('All');
    const [walletData, setWalletData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [actionStatus, setActionStatus] = useState({ message: '', type: '' });

    // Mock Context since auth isn't built yet
    // Using Ahmed Ali's Seeded UUID
    const MOCK_USER_ID = 'e0000000-0000-0000-0000-000000000001';
    const MOCK_PHONE = '0700000000';

    const loadWallet = async () => {
        setIsLoading(true);
        const res = await fetchWalletBalance(MOCK_USER_ID);
        if (res && res.status === 'success') {
            setWalletData(res.data);
        } else {
            // Fallback data if DB is not seeded or user doesn't exist yet
            setWalletData({
                balance_ugx: '45000',
                full_name: 'Ahmed Ali (Demo)',
                tenant_name: 'Grand Kampala Suites'
            });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadWallet();
    }, []);

    const handleTopUp = async (provider) => {
        if (isLoading) return;
        const amount = prompt(`Enter amount to top-up via ${provider} (UGX):`, "50000");
        if (amount && !isNaN(amount)) {
            setIsLoading(true);
            const res = await simulateTopUp(MOCK_PHONE, parseFloat(amount), MOCK_USER_ID);
            if (res.status === 'success') {
                setActionStatus({ message: `Successfully topped up UGX ${amount}!`, type: 'success' });
                await loadWallet();
            } else {
                setActionStatus({ message: res.message || 'Top-up failed.', type: 'error' });
                setIsLoading(false);
            }
        }
        setTimeout(() => setActionStatus({ message: '', type: '' }), 5000);
    };

    const handleUnlock = async () => {
        if (isLoading) return;
        setIsTapped(true);
        setIsLoading(true);

        const res = await triggerUnlock('MAC-MOCK', 'RFID-8892');

        if (res.status === 'granted') {
            setActionStatus({ message: 'Door Unlocked Successfully!', type: 'success' });
            await loadWallet(); // Balance might update if we combine rules
        } else {
            setActionStatus({ message: `Access Denied: ${res.reason || res.message}`, type: 'error' });
        }

        setTimeout(() => setIsTapped(false), 300);
        setIsLoading(false);
        setTimeout(() => setActionStatus({ message: '', type: '' }), 5000);
    };

    return (
        <div className="bg-black min-h-screen flex justify-center w-full relative">
            {/* Action Alert Banner */}
            {actionStatus.message && (
                <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl backdrop-blur-md border ${actionStatus.type === 'success' ? 'bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981]'
                    : 'bg-[#EF4444]/20 border-[#EF4444]/50 text-[#EF4444]'
                    }`}>
                    <p className="text-sm font-bold tracking-wide">{actionStatus.message}</p>
                </div>
            )}

            {/* Mobile PWA Container */}
            <div className="w-full max-w-md bg-[#050B14] min-h-screen relative shadow-2xl overflow-x-hidden flex flex-col font-sans text-white border-x border-gray-800">

                {/* Soft Background Globs for Glassmorphism Context */}
                <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[40%] bg-[#0A1F44] opacity-40 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute bottom-[20%] right-[-20%] w-[50%] h-[30%] bg-[#FFA500]/10 opacity-60 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="flex-1 overflow-y-auto pb-28 custom-scrollbar relative z-10 w-full">

                    {/* Header & Context */}
                    <div className="pt-12 px-6 pb-6 flex justify-between items-center w-full">
                        <div className="flex items-center gap-3 w-full">
                            <div className="bg-gradient-to-tr from-gray-800 to-gray-700 rounded-full h-12 w-12 flex items-center justify-center p-[2px] shadow-lg shrink-0">
                                <div className="bg-[#050B14] h-full w-full rounded-full flex items-center justify-center">
                                    <UserAvatar />
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-gray-400 text-sm font-medium">Welcome,</p>
                                <h1 className="text-xl font-bold text-white tracking-wide truncate">
                                    {walletData ? walletData.full_name : 'Loading...'}
                                </h1>
                            </div>
                            <div className="flex flex-col items-end shrink-0">
                                <span className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-200 shadow-sm flex items-center gap-1.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                                    </span>
                                    Room 101 - Active
                                </span>
                                <p className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-wider">
                                    {walletData ? walletData.tenant_name : 'Loading...'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Time Wallet (The Financial Core) */}
                    <div className="px-6 mb-8 w-full">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden">
                            {/* Micro-glow strictly inside card */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFA500]/20 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="flex justify-between items-start mb-1 relative z-10">
                                <p className="text-gray-400 text-sm font-medium tracking-wide">Time Wallet Balance</p>
                            </div>

                            <div className="flex items-baseline gap-1 mb-4 relative z-10">
                                <span className="text-xl font-bold text-gray-300">UGX</span>
                                <h2 className="text-[2.75rem] leading-tight font-extrabold text-white tracking-tighter drop-shadow-md">
                                    {walletData ? parseFloat(walletData.balance_ugx).toLocaleString() : '...'}
                                </h2>
                            </div>

                            <div className="bg-[#0A1F44]/50 border border-[#0A1F44] rounded-xl px-4 py-3 mb-6 inline-flex w-full relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="bg-[#0A1F44] p-1.5 rounded-lg border border-[#1e3a70]">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-white text-xs font-bold font-sans">Equivalent to: <span className="text-[#FFA500]">3 Days, 4 Hours</span> of access</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions Base */}
                            <div className="grid grid-cols-2 gap-3 relative z-10 mb-3">
                                <button onClick={() => handleTopUp('MTN')} disabled={isLoading} className="bg-[#FFCC00]/90 hover:bg-[#FFCC00] disabled:opacity-50 active:scale-95 text-black font-bold py-3 px-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md text-sm">
                                    <PhoneIcon /> MTN MoMo
                                </button>
                                <button onClick={() => handleTopUp('Airtel')} disabled={isLoading} className="bg-[#EF4444]/90 hover:bg-[#EF4444] disabled:opacity-50 active:scale-95 text-white font-bold py-3 px-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md text-sm">
                                    <PhoneIcon /> Airtel Money
                                </button>
                            </div>
                            <button className="w-full bg-white/5 hover:bg-white/10 active:bg-white/5 border border-white/10 text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm">
                                <ReceiptIcon /> Generate Receipt
                            </button>
                        </div>
                    </div>

                    {/* Digital Key & Hardware Sync (The Core Action) */}
                    <div className="flex flex-col items-center justify-center mb-10 w-full relative">
                        <div className="relative">
                            {/* Animated Rings mimicking radar/NFC broadcast */}
                            <div className="absolute inset-0 rounded-full bg-[#06B6D4]/10 animate-ping shadow-[0_0_20px_#06B6D4] opacity-50" style={{ animationDuration: '2.5s' }}></div>
                            <div className="absolute inset-0 rounded-full bg-[#06B6D4]/5 animate-pulse shadow-[0_0_40px_rgba(6,182,212,0.3)]" style={{ animationDuration: '2s', transform: 'scale(1.3)' }}></div>

                            <button
                                onClick={handleUnlock}
                                disabled={isLoading}
                                className={`relative z-10 w-44 h-44 rounded-full bg-gradient-to-tr from-[#0A1F44] to-[#1e3a70] border border-[#06B6D4]/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] flex flex-col items-center justify-center transition-all duration-150 ease-out select-none outline-none overflow-hidden ${isTapped || isLoading ? 'scale-95 shadow-inner opacity-80' : 'hover:scale-[1.02]'}`}
                            >
                                {/* Fingerprint glow layer */}
                                <div className="absolute inset-0 flex items-center justify-center bg-[#06B6D4]/10 mix-blend-overlay"></div>
                                <FingerprintIcon size="h-14 w-14 text-[#06B6D4] mb-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                                <span className="text-[#06B6D4] font-black text-sm tracking-[0.2em] uppercase z-10">TAP TO UNLOCK</span>
                            </button>
                        </div>

                        <button className="bg-white/5 border border-white/10 px-5 py-2.5 rounded-full mt-8 flex items-center gap-2 text-gray-300 font-semibold text-sm hover:text-white transition-colors active:bg-white/10 z-10 backdrop-blur-sm">
                            <QRIcon /> Show QR Code
                        </button>
                    </div>

                    {/* Access Credentials Manager */}
                    <div className="px-6 mb-8 w-full">
                        <h3 className="text-lg font-bold text-white mb-4">Access Credentials</h3>
                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                            <div className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]"><FingerprintIcon size="h-5 w-5" /></div>
                                    <span className="text-sm font-semibold text-gray-200">Fingerprint</span>
                                </div>
                                <div className="flex items-center text-xs font-bold">
                                    <span className="text-gray-400 mr-2">Enrolled</span> <CheckCircleIcon />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-800 rounded-lg text-gray-500"><FaceIcon /></div>
                                    <span className="text-sm font-semibold text-gray-400">Facial Recognition</span>
                                </div>
                                <div className="flex items-center text-xs font-bold">
                                    <span className="text-gray-500 mr-2">Not Enrolled</span> <XCircleIcon />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#0A1F44] border border-[#1e3a70] rounded-lg text-white"><CardIcon /></div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-200 block">RFID/NFC Card</span>
                                        <button className="text-[10px] text-[#EF4444] font-bold mt-0.5 uppercase tracking-wider hover:underline">Report Lost</button>
                                    </div>
                                </div>
                                <div className="flex items-center text-xs font-bold bg-[#0A1F44] px-2 py-1 rounded text-gray-300 border border-[#1e3a70]">
                                    Linked (#8892) <span className="ml-1 text-[#10B981] text-sm">💳</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Activity Feed */}
                    <div className="px-6 w-full mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">Activity Feed</h3>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2 mb-4 overflow-x-auto custom-scrollbar pb-1">
                            {['All', 'Access Logs', 'Payments'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${filter === f
                                        ? 'bg-white text-black border-white'
                                        : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-3">
                            {/* Feed Item 1 */}
                            <div className="bg-white/5 border border-white/5 flex items-center p-3.5 rounded-2xl shadow-sm backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mr-3">
                                    <UnlockLogIcon />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-white truncate">Room 101 - Unlocked</h4>
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">via RFID Card</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs text-gray-500 font-medium">08:30 AM</p>
                                </div>
                            </div>

                            {/* Feed Item 2 */}
                            <div className="bg-white/5 border border-white/5 flex items-center p-3.5 rounded-2xl shadow-sm backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center shrink-0 mr-3">
                                    <TopupAlertIcon />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-white truncate">Wallet Top-up</h4>
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">via MTN MoMo</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-[#10B981]">+UGX 50,000</p>
                                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">Yesterday</p>
                                </div>
                            </div>

                            {/* Feed Item 3 */}
                            <div className="bg-white/5 border border-white/5 flex items-center p-3.5 rounded-2xl shadow-sm backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center shrink-0 mr-3">
                                    <DeductIcon />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-white truncate">Daily Rent Deducted</h4>
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">Auto System</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-[#EF4444]">-UGX 15,000</p>
                                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">Yesterday</p>
                                </div>
                            </div>

                            {/* Feed Item 4 */}
                            <div className="bg-white/5 border border-white/5 flex items-center p-3.5 rounded-2xl shadow-sm backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mr-3">
                                    <UnlockLogIcon />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-white truncate">Main Gate - Unlocked</h4>
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">via Biometric</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs text-gray-500 font-medium">Mon, 18:45</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Fixed Bottom Navigation Bar (App Feel) */}
                <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md pb-6 pt-3 px-6 bg-[#050B14]/80 backdrop-blur-xl border-t border-white/10 flex justify-between items-center z-50">
                    <button className="flex flex-col items-center gap-1 w-16">
                        <NavHomeIcon active={true} />
                        <span className="text-[10px] font-bold text-white">Home</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 w-16">
                        <NavWalletIcon active={false} />
                        <span className="text-[10px] font-bold text-gray-500">Wallet</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 w-16">
                        <NavKeyIcon active={false} />
                        <span className="text-[10px] font-bold text-gray-500">Keys</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 w-16">
                        <NavSettingsIcon active={false} />
                        <span className="text-[10px] font-bold text-gray-500">Settings</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default UserDashboard;
