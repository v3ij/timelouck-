import React, { useState, useEffect } from 'react';

// Reusable SVG Icons for the Enrollment Station
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const WalletCashIconMini = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const FingerprintIcon = ({ animating }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-24 w-24 ${animating ? 'text-[#06B6D4] animate-pulse drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
    </svg>
);

const FaceIcon = ({ animating }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-24 w-24 ${animating ? 'text-[#06B6D4] animate-pulse drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const RFIDIcon = ({ animating }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-24 w-24 ${animating ? 'text-[#06B6D4] animate-pulse drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const DeviceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#10B981]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const CPUIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#06B6D4] inline mb-0.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
);

const Enrollment = () => {
    const [activeTab, setActiveTab] = useState('Fingerprint');
    const [scanState, setScanState] = useState('idle'); // idle, scanning, success
    const [scanText, setScanText] = useState('Waiting for device input...');

    const handleScan = () => {
        if (scanState === 'scanning') return;

        setScanState('scanning');
        setScanText('Connecting to hardware...');

        setTimeout(() => {
            setScanText('Capturing minutiae data...');
        }, 1500);

        setTimeout(() => {
            setScanText('Hash generated and secured.');
            setScanState('success');
        }, 3500);
    };

    const resetScan = () => {
        setScanState('idle');
        setScanText('Waiting for device input...');
    };

    // Switch tab resets scan state
    useEffect(() => {
        resetScan();
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-8 flex flex-col items-center">
            <div className="w-full max-w-6xl">

                {/* Header Section */}
                <div className="mb-8 border-b border-gray-200 pb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#0A1F44] tracking-tight flex items-center gap-3">
                            Hardware Enrollment Station
                            <span className="bg-[#0A1F44]/10 text-[#0A1F44] text-xs px-2.5 py-1 rounded-full border border-[#0A1F44]/20 uppercase tracking-widest font-bold">Admin</span>
                        </h1>
                        <p className="text-gray-500 mt-2 text-base font-medium">Connect Biometrics & RFID Cards to User Accounts</p>
                    </div>
                    <div className="hidden md:flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <span className="relative flex h-3 w-3 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06B6D4] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#06B6D4]"></span>
                        </span>
                        <span className="text-sm font-bold text-[#0A1F44]">Cloud Sync Active</span>
                    </div>
                </div>

                {/* Main Layout (Split Screen) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column (User Selection) */}
                    <div className="lg:col-span-5 flex flex-col gap-6">

                        {/* Search Bar */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500] sm:text-sm transition-all text-[#0A1F44] font-medium"
                                    placeholder="Search Student / Guest Name..."
                                    defaultValue="Ahmed Ali"
                                />
                            </div>
                        </div>

                        {/* Selected Profile Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1 relative overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full pointer-events-none -mr-10 -mt-10 border-l border-b border-gray-100"></div>

                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Selected Profile</h3>

                            <div className="flex items-start gap-5 mb-6 relative z-10">
                                <div className="h-16 w-16 rounded-2xl bg-[#0A1F44]/5 flex items-center justify-center border border-[#0A1F44]/10">
                                    <UserIcon />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold text-[#0A1F44]">Ahmed Ali</h2>
                                    <p className="text-sm text-gray-500 font-mono mt-0.5">ID: 10994-VX</p>

                                    <div className="mt-3 inline-flex items-center gap-2 bg-[#10B981]/10 text-[#10B981] px-3 py-1.5 rounded-lg border border-[#10B981]/20">
                                        <WalletCashIconMini />
                                        <span className="text-sm font-bold">Wallet: UGX 15,000</span>
                                    </div>
                                </div>
                            </div>

                            {/* Assign Access Level */}
                            <div className="mt-8 pt-6 border-t border-gray-100 relative z-10">
                                <label className="block text-sm font-bold text-[#0A1F44] mb-3">Assign Access Level</label>
                                <div className="relative">
                                    <select className="block w-full pl-4 pr-10 py-3 text-base border-gray-200 focus:outline-none focus:ring-[#FFA500] focus:border-[#FFA500] sm:text-sm rounded-xl bg-gray-50 border text-[#0A1F44] font-medium appearance-none cursor-pointer">
                                        <option>Main Gate + Core Facilities</option>
                                        <option>All Labs (Science & Computer)</option>
                                        <option>VIP Lounge & Admin Block</option>
                                        <option>Dormitory B - Only</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (The Scanner Interface - The WOW Factor) */}
                    <div className="lg:col-span-7 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">

                        {/* Scanner Header / Device Selector */}
                        <div className="bg-[#0A1F44] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#143265] relative overflow-hidden">
                            {/* Decorative glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#06B6D4] opacity-10 rounded-full blur-[60px] transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

                            <div className="relative z-10 flex-1 w-full sm:w-auto">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Active Hardware Node</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DeviceIcon />
                                    </div>
                                    <select className="block w-full pl-10 pr-10 py-2.5 text-sm border-transparent focus:outline-none focus:ring-1 focus:ring-[#06B6D4] rounded-lg bg-[#143265] text-white font-semibold appearance-none cursor-pointer">
                                        <option>Reception Desk - Timmy TL90</option>
                                        <option>Enrolment Kiosk 2 - Timmy X1</option>
                                        <option>Mobile Admin Tablet Array</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 bg-[#143265] border border-[#1e3a70] px-3 py-2 rounded-lg relative z-10 md:self-end">
                                <div className="w-2 h-2 bg-[#06B6D4] rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                                <span className="text-xs font-bold text-[#06B6D4]">Device Online</span>
                            </div>
                        </div>

                        {/* Scan Type Tabs */}
                        <div className="flex border-b border-gray-200 bg-gray-50">
                            {['Fingerprint', 'Facial Recognition', 'RFID Card'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === tab
                                            ? 'border-[#0A1F44] text-[#0A1F44] bg-white'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* The Visualizer (High-Tech Box) */}
                        <div className="p-8 flex-1 flex flex-col items-center justify-center bg-gray-50 relative">

                            {/* Dark Tech Box */}
                            <div className="w-full max-w-sm bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8 flex flex-col items-center relative overflow-hidden group">

                                {/* Background Tech Details */}
                                <div className="absolute inset-0 border-[1px] border-[#06B6D4]/10 m-4 rounded-xl pointer-events-none"></div>
                                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#06B6D4]/30 pointer-events-none"></div>
                                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#06B6D4]/30 pointer-events-none"></div>
                                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#06B6D4]/30 pointer-events-none"></div>
                                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#06B6D4]/30 pointer-events-none"></div>

                                {/* Scanner Icon/Animation */}
                                <div className="relative mb-8 h-32 w-32 flex items-center justify-center">
                                    {/* Scan line effect when scanning */}
                                    {scanState === 'scanning' && (
                                        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#06B6D4] shadow-[0_0_10px_#06B6D4] animate-[scan_1.5s_ease-in-out_infinite] z-20"></div>
                                    )}

                                    {activeTab === 'Fingerprint' && <FingerprintIcon animating={scanState === 'scanning'} />}
                                    {activeTab === 'Facial Recognition' && <FaceIcon animating={scanState === 'scanning'} />}
                                    {activeTab === 'RFID Card' && <RFIDIcon animating={scanState === 'scanning'} />}

                                    {/* Success Overlay */}
                                    {scanState === 'success' && (
                                        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center z-30 animate-in fade-in zoom-in duration-300">
                                            <div className="bg-[#10B981] text-white rounded-full p-2 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Status Text Area */}
                                <div className="w-full text-center mb-8 h-12 flex flex-col justify-center">
                                    <p className={`text-sm font-mono tracking-wider transition-colors duration-300 ${scanState === 'idle' ? 'text-gray-500' :
                                            scanState === 'scanning' ? 'text-[#06B6D4]' :
                                                'text-[#10B981]'
                                        }`}>
                                        {scanState === 'scanning' && <span className="inline-block animate-pulse w-2 h-2 bg-[#06B6D4] rounded-full mr-2 mb-0.5"></span>}
                                        {scanText}
                                    </p>
                                </div>

                                {/* Action Button */}
                                {scanState !== 'success' ? (
                                    <button
                                        onClick={handleScan}
                                        disabled={scanState === 'scanning'}
                                        className={`w-full font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 ${scanState === 'scanning'
                                                ? 'bg-[#143265] text-gray-400 cursor-not-allowed border border-gray-700'
                                                : 'bg-[#FFA500] hover:bg-[#ffb732] active:bg-[#e59400] text-[#0A1F44] shadow-[0_0_20px_rgba(255,165,0,0.2)] hover:shadow-[0_0_25px_rgba(255,165,0,0.4)]'
                                            }`}
                                    >
                                        {scanState === 'scanning' ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CPUIcon />
                                                Initialize Scanner
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={resetScan}
                                        className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors border border-gray-700"
                                    >
                                        Scan Again
                                    </button>
                                )}

                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-8 flex justify-end">
                    <button
                        disabled={scanState !== 'success'}
                        className={`font-bold py-4 px-8 rounded-xl shadow-lg transition-all flex items-center justify-center text-lg ${scanState === 'success'
                                ? 'bg-[#10B981] hover:bg-emerald-400 text-white shadow-[#10B981]/30 hover:shadow-[#10B981]/50 transform hover:-translate-y-0.5'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300 shadow-none'
                            }`}
                    >
                        {scanState === 'success' && <CheckCircleIcon />}
                        <span className={scanState === 'success' ? 'ml-2' : ''}>Save & Sync to Smart Locks</span>
                    </button>
                </div>

            </div>

            {/* Animation definition for the scanning laser line */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
        </div>
    );
};

export default Enrollment;
