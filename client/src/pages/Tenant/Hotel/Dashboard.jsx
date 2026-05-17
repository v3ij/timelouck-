import React, { useState, useEffect } from 'react';
import { fetchTenantStats, fetchTenantNotifications } from '../../../services/api';

// Reusable SVG Icons tailored for the Hotel/Micro-Leasing Dashboard
const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const WalletCashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const AlertWarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#10B981]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const BoltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-[#FFA500] inline" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const HotelDashboard = () => {
    const HOTEL_TENANT_ID = 2; // Seeded Grand Kampala Suites ID

    const [stats, setStats] = useState({
        totalUsers: 0,
        lowBalanceUsers: 0,
        activeLocks: 0,
        inactiveLocks: 0,
        dailyRentCollectedUgx: 0,
        rooms: []
    });
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            setIsLoading(true);
            const res = await fetchTenantStats(HOTEL_TENANT_ID);
            if (res && res.status === 'success') {
                setStats(res.data);
            }
            const notifRes = await fetchTenantNotifications(HOTEL_TENANT_ID);
            if (notifRes && notifRes.status === 'success') {
                setNotifications(notifRes.data);
            }
            setIsLoading(false);
        };
        loadStats();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-8">
            {/* Header Section */}
            <div className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#0A1F44] tracking-tight">Grand Kampala Suites <span className="text-gray-400 font-light">- Property Portal</span></h1>
                    <p className="text-gray-500 mt-2 text-lg font-medium">Micro-Leasing & Smart Lock Management</p>
                </div>
                <div className="hidden md:flex items-center space-x-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                    {isLoading ? (
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-[#0A1F44]"></span>
                    ) : (
                        <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    )}
                    <span className="text-sm font-bold text-[#0A1F44]">
                        {isLoading ? 'Syncing...' : 'Engine Active'}
                    </span>
                </div>
            </div>

            {/* Top Grid - 4 Financial & Operational Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                {/* Card 1: Live Occupancy */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-[#0A1F44]/10 p-3 rounded-xl text-[#0A1F44] group-hover:bg-[#0A1F44] group-hover:text-white transition-colors duration-300">
                            <BuildingIcon />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Live Occupancy</p>
                        <h2 className="text-3xl font-bold text-[#0A1F44] mb-2">
                            {isLoading ? '...' : stats.totalUsers}
                        </h2>
                        <p className="text-gray-500 text-sm font-medium">
                            <span className="text-[#0A1F44] font-semibold">Active Profiles</span>
                        </p>
                    </div>
                </div>

                {/* Card 2: Daily Micro-Rent Revenue (Green Focus) */}
                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl p-6 shadow-sm border border-[#10B981] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="bg-white/20 p-3 rounded-xl text-white backdrop-blur-sm">
                            <WalletCashIcon />
                        </div>
                        <span className="text-white/90 text-xs font-bold uppercase tracking-wider bg-black/10 px-3 py-1 rounded-full flex items-center">
                            <ClockIcon /> Auto-Collecting
                        </span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-emerald-100 text-sm font-medium mb-1">Total System Revenue</p>
                        <h2 className="text-3xl font-bold text-white mb-1">
                            {isLoading ? '...' : `UGX ${stats.dailyRentCollectedUgx.toLocaleString()}`}
                        </h2>
                        <p className="text-white/80 text-sm font-semibold mt-2">
                            Cumulative across all channels
                        </p>
                    </div>
                </div>

                {/* Card 3: Low Wallet Warnings (Orange Alert) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="bg-[#FFA500]/10 p-3 rounded-xl text-[#FFA500] group-hover:bg-[#FFA500] group-hover:text-white transition-colors duration-300">
                            <AlertWarningIcon />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-500 text-sm font-medium mb-1">Low Wallet Warnings</p>
                        <h2 className="text-3xl font-bold text-[#F59E0B] mb-2 flex items-baseline gap-2">
                            {isLoading ? '...' : stats.lowBalanceUsers} <span className="text-lg font-medium text-gray-400">Guests</span>
                        </h2>
                        <div className="flex items-center text-gray-600 text-sm font-medium">
                            <span>Balance &lt; <strong className="text-[#F59E0B]">UGX 50,000</strong></span>
                        </div>
                    </div>
                </div>

                {/* Card 4: Hardware Status */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-gray-50 p-3 rounded-xl text-gray-600 group-hover:bg-gray-800 group-hover:text-white transition-colors duration-300">
                            <LockIcon />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Hardware Status</p>
                        <h2 className="text-3xl font-bold text-[#0A1F44] mb-2">
                            {isLoading ? '...' : stats.activeLocks} <span className="text-base font-normal text-gray-400">Online</span>
                        </h2>
                        <div className="flex items-center text-[#10B981] text-sm font-semibold">
                            <CheckCircleIcon />
                            <span className="ml-1">Syncing to cloud</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Split - Visual Grid & Billing Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Visual Room Grid */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-[560px]">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#0A1F44] p-2 rounded-lg text-white shadow-sm">
                                <BuildingIcon />
                            </div>
                            <h3 className="text-xl font-bold text-[#0A1F44]">Visual Room Matrix</h3>
                        </div>

                        {/* Legend */}
                        <div className="hidden sm:flex items-center space-x-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 text-xs font-semibold">
                            <span className="flex items-center text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981] mr-1.5 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span> Active</span>
                            <span className="flex items-center text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] mr-1.5 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span> Denied</span>
                            <span className="flex items-center text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-gray-300 mr-1.5"></span> Vacant</span>
                        </div>
                    </div>

                    {/* Grid Container */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isLoading ? (
                                <div className="col-span-2 text-center py-10 text-gray-500 font-medium">Loading rooms...</div>
                            ) : stats.rooms && stats.rooms.length > 0 ? (
                                stats.rooms.map((room) => (
                                    <div 
                                        key={room.id} 
                                        className={`bg-white border-2 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group ${
                                            room.status === 'Occupied' 
                                                ? (room.payment === 'Paid' ? 'border-[#10B981]/20' : 'border-[#F59E0B]/30') 
                                                : 'border-gray-200 border-dashed bg-gray-50/80'
                                        }`}
                                    >
                                        <div className={`absolute top-0 right-0 p-3 opacity-10 pointer-events-none transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform ${
                                            room.status === 'Occupied' 
                                                ? (room.payment === 'Paid' ? 'text-[#10B981]' : 'text-[#F59E0B]') 
                                                : 'text-gray-800'
                                        }`}>
                                            <LockIcon />
                                        </div>
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className={`text-lg font-bold ${room.status === 'Occupied' ? 'text-[#0A1F44]' : 'text-gray-600'}`}>Room {room.id}</h4>
                                            <span className={`text-xs font-bold px-2 py-1 rounded border ${
                                                room.status === 'Occupied' 
                                                    ? (room.payment === 'Paid' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20') 
                                                    : 'bg-gray-200 text-gray-600 border-gray-300'
                                            }`}>
                                                {room.status === 'Occupied' ? (room.payment === 'Paid' ? 'Active' : 'Warning') : 'Vacant'}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className={`text-sm font-medium flex items-center ${room.status === 'Occupied' ? 'text-gray-800' : 'text-gray-500 opacity-60'}`}>
                                                <UsersIconMini /> <span className="ml-2">Guest: {room.guest}</span>
                                            </p>
                                            <p className={`text-sm font-bold flex items-center ${
                                                room.status === 'Occupied' 
                                                    ? (room.payment === 'Paid' ? 'text-[#10B981]' : 'text-[#F59E0B]') 
                                                    : 'text-gray-500 opacity-60'
                                            }`}>
                                                <WalletCashIconMini /> <span className="ml-2">
                                                    {room.status === 'Occupied' ? (room.payment === 'Paid' ? 'Wallet: Active' : 'Wallet: Warning') : 'Wallet: Inactive'}
                                                </span>
                                            </p>
                                            <p className="text-xs text-gray-500 font-medium flex items-center mt-2 pt-2 border-t border-gray-50">
                                                <LockIconMini /> <span className="ml-2">Lock: {room.lock}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-10 text-gray-500 font-medium">No rooms configured</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Automated Billing Feed */}
                <div className="bg-[#09152b] rounded-2xl p-0 shadow-sm border border-[#143265] flex flex-col h-[560px] overflow-hidden relative">
                    {/* Engine visual effect */}
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#FFA500]/10 rounded-full blur-[60px] pointer-events-none"></div>

                    <div className="p-6 border-b border-[#143265] bg-[#09152b]/80 backdrop-blur-sm z-10 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            <BoltIcon />
                            Time Wallet Engine
                        </h3>
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3 z-10">
                        {isLoading ? (
                            <div className="text-center py-8 text-gray-400 font-medium">Syncing Time Wallet Engine logs...</div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 font-medium">No live Time Wallet billing actions recorded.</div>
                        ) : (
                            notifications.map((notif) => {
                                const isInsufficient = notif.message.toLowerCase().includes('insufficient') || notif.message.toLowerCase().includes('restricted') || notif.message.toLowerCase().includes('low balance') || notif.message.toLowerCase().includes('alert');
                                const isTopup = notif.message.toLowerCase().includes('topup') || notif.message.toLowerCase().includes('received') || notif.message.toLowerCase().includes('credited');
                                
                                return (
                                    <div key={notif.id} className={`bg-[#0f2347] border rounded-xl p-3 shadow-inner relative overflow-hidden ${
                                        isInsufficient ? 'border-[#ef4444]/30' : isTopup ? 'border-[#FFA500]/30' : 'border-[#1e3a70]'
                                    }`}>
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                            isInsufficient ? 'bg-[#EF4444]' : isTopup ? 'bg-[#FFA500]' : 'bg-[#10B981]'
                                        }`}></div>
                                        <div className="flex justify-between items-start">
                                            <p className={`text-xs font-mono px-2 py-0.5 rounded ml-1 ${
                                                isInsufficient ? 'text-[#EF4444] bg-[#EF4444]/10' : isTopup ? 'text-[#FFA500] bg-[#FFA500]/10' : 'text-[#10B981] bg-[#10B981]/10'
                                            }`}>
                                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <span className="text-xs text-gray-400">
                                                {isInsufficient ? 'Lock Controller' : isTopup ? 'Mobile Money API' : 'System Engine'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-300 mt-2 leading-relaxed ml-1">
                                            <span className="text-white font-semibold">{notif.fullName || 'Guest'}</span>: {notif.message}
                                        </p>
                                        <div className="mt-2 ml-1 text-xs text-gray-400 font-medium flex items-center">
                                            {isInsufficient ? (
                                                <span className="text-[#EF4444] font-semibold flex items-center"><XCircleIconMini /> Restricting access...</span>
                                            ) : (
                                                <span className="text-[#10B981] font-semibold flex items-center"><CheckCircleIconMini /> Success</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

// Miniature Icons for the Room Grid
const UsersIconMini = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const WalletCashIconMini = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const LockIconMini = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const CheckCircleIconMini = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const XCircleIconMini = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-[#EF4444]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);

export default HotelDashboard;
