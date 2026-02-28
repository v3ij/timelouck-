import React, { useState } from 'react';
import {
    Wallet, Lock, Clock, ArrowRightLeft, QrCode, Fingerprint,
    Wifi, CreditCard, Landmark, CheckCircle, ShieldCheck, Smartphone
} from 'lucide-react';

const EcosystemMap = () => {
    // State for interactive elements
    const [balance, setBalance] = useState(50000);
    const [conversionAmount, setConversionAmount] = useState(10000); // UGX
    const [accessMethods, setAccessMethods] = useState({
        qr: true,
        biometric: false,
        nfc: true
    });
    const [isDoorLocked, setIsDoorLocked] = useState(true);

    const toggleAccess = (method) => {
        setAccessMethods(prev => ({ ...prev, [method]: !prev[method] }));
    };

    const handleConversion = () => {
        alert(`Converting ${conversionAmount.toLocaleString()} UGX to ${(conversionAmount / 1000).toFixed(1)} Access Hours`);
    };

    return (
        <div className="min-h-screen bg-slate-900 p-4 md:p-8 font-sans text-slate-100 overflow-x-hidden">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-green-400 to-orange-400">
                    SaaS Ecosystem Control Panel
                </h1>
                <p className="text-slate-400 text-sm mt-2">Visual Logic Map • Tenant: Kampala International School</p>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

                {/* ZONE 1: USER APP (BLUE STYLE) */}
                <div className="flex flex-col gap-6 p-6 rounded-3xl bg-blue-950/30 border border-blue-500/30 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400"></div>
                    <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                        <Smartphone className="w-6 h-6" /> USER APP
                    </h2>

                    {/* Card 1: Time Wallet [cite: 240] */}
                    <div className="bg-slate-800/50 p-5 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Time Wallet</span>
                            <Wallet className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="text-2xl font-bold text-white mb-4">
                            UGX {balance.toLocaleString()}
                        </div>
                        <button
                            onClick={() => { setBalance(prev => prev + 5000); alert('Simulated: Recharged 5,000 via Mobile Money'); }}
                            className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Recharge via MM
                        </button>
                    </div>

                    {/* Card 2: Unlock Doors */}
                    <div className="bg-slate-800/50 p-5 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 transition-colors flex items-center justify-between">
                        <div>
                            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block mb-1">Door Access</span>
                            <div className={`text-sm font-medium ${!isDoorLocked ? 'text-green-400' : 'text-slate-300'}`}>
                                Status: {isDoorLocked ? 'Ready to Open' : 'UNLOCKED'}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsDoorLocked(!isDoorLocked)}
                            className={`p-4 rounded-full transition-all duration-300 ${isDoorLocked ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-green-500 text-green-900 shadow-[0_0_20px_rgba(34,197,94,0.6)]'}`}
                        >
                            <Lock className={`w-6 h-6 ${!isDoorLocked ? 'hidden' : 'block'}`} />
                            <div className={`w-6 h-6 font-bold text-xs flex items-center justify-center ${isDoorLocked ? 'hidden' : 'block'}`}>OPEN</div>
                        </button>
                    </div>

                    {/* Card 3: Buy Time */}
                    <div className="bg-slate-800/50 p-5 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 transition-colors">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Buy Time</span>
                            <Clock className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Amount"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                            />
                            <button className="px-4 py-2 bg-slate-700 hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-colors">
                                Add
                            </button>
                        </div>
                        <p className="text-xs text-blue-300/60 mt-2 text-center">Auto-converts to Hours</p>
                    </div>
                </div>

                {/* ZONE 2: CORE LOGIC (GREEN/CENTER STYLE) */}
                <div className="flex flex-col gap-6 p-6 rounded-3xl bg-emerald-950/30 border border-emerald-500/30 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-lime-400"></div>
                    <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                        <ArrowRightLeft className="w-6 h-6" /> CORE LOGIC
                    </h2>

                    {/* FEATURE: Money <-> Time Converter */}
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-900/10">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Money ↔ Time Engine
                        </h3>

                        <div className="mb-6">
                            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                                <span>INPUT (UGX)</span>
                                <span>OUTPUT (HRS)</span>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-700">
                                <div className="text-xl font-mono text-emerald-400">{conversionAmount.toLocaleString()}</div>
                                <ArrowRightLeft className="w-4 h-4 text-slate-500" />
                                <div className="text-xl font-mono text-white">{(conversionAmount / 1000).toFixed(1)} hrs</div>
                            </div>
                            <input
                                type="range"
                                min="1000"
                                max="100000"
                                step="1000"
                                value={conversionAmount}
                                onChange={(e) => setConversionAmount(parseInt(e.target.value))}
                                className="w-full mt-4 accent-emerald-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <button
                            onClick={handleConversion}
                            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold tracking-wide shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                        >
                            EXECUTE CONVERSION
                        </button>
                    </div>

                    {/* FEATURE: Access Methods [cite: 238] */}
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-emerald-500/20">
                        <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block mb-4">Active Access Protocols</span>
                        <div className="flex justify-between gap-4">
                            {/* QR Code */}
                            <button
                                onClick={() => toggleAccess('qr')}
                                className={`flex-1 p-4 rounded-xl border border-slate-700 flex flex-col items-center gap-2 transition-all ${accessMethods.qr ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-900 text-slate-500 grayscale'}`}
                            >
                                <QrCode className="w-6 h-6" />
                                <span className="text-[10px] font-bold">QR CODE</span>
                            </button>

                            {/* Biometric */}
                            <button
                                onClick={() => toggleAccess('biometric')}
                                className={`flex-1 p-4 rounded-xl border border-slate-700 flex flex-col items-center gap-2 transition-all ${accessMethods.biometric ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-900 text-slate-500 opacity-60'}`}
                            >
                                <Fingerprint className="w-6 h-6" />
                                <span className="text-[10px] font-bold">BIO (WIP)</span>
                            </button>

                            {/* NFC */}
                            <button
                                onClick={() => toggleAccess('nfc')}
                                className={`flex-1 p-4 rounded-xl border border-slate-700 flex flex-col items-center gap-2 transition-all ${accessMethods.nfc ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-900 text-slate-500 grayscale'}`}
                            >
                                <Wifi className="w-6 h-6" />
                                <span className="text-[10px] font-bold">NFC</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ZONE 3: PAYMENTS & GOV (ORANGE/PURPLE STYLE) */}
                <div className="flex flex-col gap-6 p-6 rounded-3xl bg-slate-800/30 border border-orange-500/30 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-purple-600"></div>
                    <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
                        <Landmark className="w-6 h-6" /> PAYMENTS & GOV
                    </h2>

                    {/* Card: Payments Gateway */}
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-orange-500/20 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Gateway Status</span>
                            <div className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-[10px] font-bold border border-green-500/30">
                                API CONNECTED
                            </div>
                        </div>

                        <div className="flex gap-3 mb-6">
                            <div className="h-10 w-16 bg-white rounded flex items-center justify-center">
                                <span className="font-bold text-blue-900 italic">VISA</span>
                            </div>
                            <div className="h-10 w-16 bg-yellow-400 rounded flex items-center justify-center">
                                <span className="font-bold text-black text-xs">MTN</span>
                            </div>
                            <div className="h-10 w-16 bg-red-600 rounded flex items-center justify-center">
                                <span className="font-bold text-white text-xs">Airtel</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Throughput</span>
                                <span>98.5%</span>
                            </div>
                            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-orange-500 h-full w-[98.5%]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Card: Government Portal [cite: 453] */}
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">URA / Gov Portal</span>
                            <ShieldCheck className="w-6 h-6 text-purple-400" />
                        </div>

                        <div className="flex items-center gap-3 mb-4 bg-purple-900/20 p-3 rounded-xl border border-purple-500/20">
                            <CheckCircle className="w-5 h-5 text-purple-400" />
                            <div>
                                <div className="text-sm font-bold text-white">Tax Compliance</div>
                                <div className="text-xs text-purple-300">Verified • ID: URA-9928</div>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">Last Audit</span>
                                <span className="text-site-200">2026-02-14</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto text-center">
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest">Secure • Encrpyted • Compliant</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EcosystemMap;
