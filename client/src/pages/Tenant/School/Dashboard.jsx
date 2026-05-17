import React, { useState, useEffect } from 'react';
import { fetchTenantStats, fetchTenantNotifications } from '../../../services/api';

// Reusable SVG Icons tailored for the School Dashboard
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MessageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
);

const WalletAlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
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

const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#EF4444]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);

const BatteryIcon = ({ level, isLow }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLow ? 'text-[#FFA500]' : 'text-[#10B981]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h14a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M22 11v2M6 10h4v4H6zM12 10h2v4h-2z" />
        {/* Simulate battery level filling */}
        {level > 50 && <path strokeLinecap="round" strokeLinejoin="round" d="M16 10h2v4h-2z" />}
    </svg>
);

const ShieldExclamationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);


const SchoolDashboard = () => {
    const SCHOOL_TENANT_ID = 1; // Seeded Kampala High ID

    const [stats, setStats] = useState({
        totalUsers: 0,
        lowBalanceUsers: 0,
        activeLocks: 0,
        dailyRentCollectedUgx: 0
    });
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            setIsLoading(true);
            const res = await fetchTenantStats(SCHOOL_TENANT_ID);
            if (res && res.status === 'success') {
                setStats(res.data);
            }
            const notifRes = await fetchTenantNotifications(SCHOOL_TENANT_ID);
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
                    <h1 className="text-4xl font-extrabold text-[#0A1F44] tracking-tight">Kampala High School <span className="text-gray-400 font-light">- Portal</span></h1>
                    <p className="text-gray-500 mt-2 text-lg font-medium">Real-time Attendance & Access Control</p>
                </div>
                <div className="hidden md:flex items-center space-x-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                    {isLoading ? (
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-[#0A1F44]"></span>
                    ) : (
                        <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    )}
                    <span className="text-sm font-bold text-[#0A1F44]">
                        {isLoading ? 'Syncing...' : 'System Online'}
                    </span>
                </div>
            </div>

            {/* Top Grid - 4 Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                {/* Card 1: Today's Attendance (Navy Blue Focus) */}
                <div className="bg-gradient-to-br from-[#0A1F44] to-[#143265] rounded-2xl p-6 shadow-sm border border-[#0A1F44] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="bg-white/20 p-3 rounded-xl text-white backdrop-blur-sm">
                            <UsersIcon />
                        </div>
                        <span className="text-white/80 text-xs font-bold uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full">Today</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-300 text-sm font-medium mb-1">Total Enrolled Students</p>
                        <h2 className="text-4xl font-bold text-white mb-1">
                            {isLoading ? '...' : stats.totalUsers}
                        </h2>
                        <p className="text-[#10B981] text-sm font-semibold mt-2">
                            Active in system
                        </p>
                    </div>
                </div>

                {/* Card 2: SMS Alerts Sent */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-[#FFA500]/10 p-3 rounded-xl text-[#FFA500] group-hover:bg-[#FFA500] group-hover:text-white transition-colors duration-300">
                            <MessageIcon />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">SMS Alerts Sent</p>
                        <h2 className="text-3xl font-bold text-[#0A1F44] mb-2">{isLoading ? '...' : notifications.length} <span className="text-base font-normal text-gray-400">Delivered</span></h2>
                        <div className="flex items-center text-gray-500 text-sm font-medium bg-gray-50 py-1 px-3 rounded-md w-max border border-gray-100">
                            <span>Cost: <strong className="text-[#0A1F44]">UGX {(notifications.length * 50).toLocaleString()}</strong></span>
                        </div>
                    </div>
                </div>

                {/* Card 3: Low Wallet Balances */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-[#EF4444]/10 p-3 rounded-xl text-[#EF4444] group-hover:bg-[#EF4444] group-hover:text-white transition-colors duration-300">
                            <WalletAlertIcon />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Low Wallet Balances</p>
                        <h2 className="text-3xl font-bold text-[#EF4444] mb-2">
                            {isLoading ? '...' : stats.lowBalanceUsers} <span className="text-base font-normal text-gray-400">Students</span>
                        </h2>
                        <p className="text-gray-500 text-sm font-medium">
                            Bal &lt; <strong className="text-[#0A1F44]">UGX 2,000</strong>
                        </p>
                    </div>
                </div>

                {/* Card 4: Campus Locks Online */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-[#10B981]/10 p-3 rounded-xl text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-colors duration-300">
                            <LockIcon />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Campus Locks</p>
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

            {/* Main Content Split - 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Live Access Stream */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-0 shadow-sm border border-gray-100 flex flex-col h-[500px] overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                        <div className="flex items-center gap-3">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]"></span>
                            </div>
                            <h3 className="text-xl font-bold text-[#0A1F44]">Live Access Stream</h3>
                        </div>
                        <button className="text-sm bg-gray-50 hover:bg-gray-100 text-[#0A1F44] font-semibold py-1.5 px-4 rounded-full transition-colors border border-gray-200">
                            Filter by Grade
                        </button>
                    </div>

                    {/* Feed Container */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50/50">
                        {isLoading ? (
                            <div className="text-center py-8 text-gray-500 font-medium">Syncing notification stream...</div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 font-medium">No live access alerts yet. Try checking in or sending a reminder!</div>
                        ) : (
                            notifications.map((notif) => {
                                const initials = notif.fullName ? notif.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'SYS';
                                const isInsufficient = notif.message.toLowerCase().includes('insufficient') || notif.message.toLowerCase().includes('restricted') || notif.message.toLowerCase().includes('low balance');
                                
                                return (
                                    <div key={notif.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${isInsufficient ? 'bg-[#EF4444]' : 'bg-[#10B981]'}`}></div>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-[#0A1F44]">
                                                    {initials}
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-bold text-[#0A1F44]">
                                                        {notif.fullName || 'System Event'} 
                                                        <span className="font-normal text-sm text-gray-500 mx-1">|</span> 
                                                        <span className="text-sm font-medium text-gray-600">{notif.phoneNumber}</span>
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{notif.message}</p>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <span className="text-xs font-mono font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                isInsufficient ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20' : 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                                            }`}>
                                                {isInsufficient ? <XCircleIcon /> : <CheckCircleIcon />}
                                                <span className="ml-1.5">{isInsufficient ? 'Access Restricted | SMS Sent' : 'Access Granted | SMS Sent'}</span>
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Column: Hardware & Operations */}
                <div className="flex flex-col gap-6">

                    {/* Quick Actions Panel */}
                    <div className="bg-[#0A1F44] rounded-2xl p-6 shadow-sm border border-[#143265] text-white relative overflow-hidden">
                        {/* Soft decorative glow */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FFA500]/20 rounded-full blur-[40px] pointer-events-none"></div>

                        <h3 className="text-lg font-bold mb-4 relative z-10">Quick Actions</h3>
                        <div className="space-y-3 relative z-10">
                            <button className="w-full bg-[#FFA500] hover:bg-[#ffb732] text-[#0A1F44] font-bold py-3 px-4 rounded-xl shadow-[0_4px_14px_0_rgba(255,165,0,0.39)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                <MessageIcon />
                                Send Top-up Reminders
                            </button>
                            <button className="w-full bg-white/10 hover:bg-[#EF4444] text-white font-bold py-3 px-4 rounded-xl border border-white/20 hover:border-[#EF4444] transition-all transform hover:-translate-y-0.5 flex items-center justify-center">
                                <ShieldExclamationIcon />
                                Lock All Doors (Emergency)
                            </button>
                        </div>
                    </div>

                    {/* Smart Lock Status Panel */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-[#0A1F44]">Smart Lock Status</h3>
                            <button className="text-[#0A1F44] hover:bg-gray-100 p-1.5 rounded-md transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Lock 1 */}
                            <div className="flex justify-between items-center p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-gray-300 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm text-gray-500">
                                        <LockIcon />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#0A1F44]">Main Gate</h4>
                                        <p className="text-xs text-[#10B981] font-semibold mt-0.5 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5"></span> Online</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-100">
                                    <BatteryIcon level={95} isLow={false} />
                                    <span className="text-sm font-bold text-gray-700">95%</span>
                                </div>
                            </div>

                            {/* Lock 2 */}
                            <div className="flex justify-between items-center p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-gray-300 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm text-gray-500">
                                        <LockIcon />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#0A1F44]">Library Entry</h4>
                                        <p className="text-xs text-[#10B981] font-semibold mt-0.5 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5"></span> Online</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-100">
                                    <BatteryIcon level={70} isLow={false} />
                                    <span className="text-sm font-bold text-gray-700">70%</span>
                                </div>
                            </div>

                            {/* Lock 3 - Low Battery */}
                            <div className="flex justify-between items-center p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-gray-300 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg border border-[#FFA500]/30 shadow-sm text-gray-500">
                                        <LockIcon />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#0A1F44]">Lab 1</h4>
                                        <p className="text-xs text-[#10B981] font-semibold mt-0.5 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5"></span> Online</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-100">
                                    <BatteryIcon level={40} isLow={true} />
                                    <span className="text-sm font-bold text-[#FFA500]">40%</span>
                                </div>
                            </div>

                        </div>

                        <button className="w-full mt-4 text-center text-sm text-[#0A1F44] font-semibold py-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200 block">
                            View All Hardware
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SchoolDashboard;
