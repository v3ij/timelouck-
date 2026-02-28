import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, School, ArrowRight, Lock } from 'lucide-react';
import Logo from '../components/Logo';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="z-10 text-center mb-12">
                <div className="flex justify-center mb-6">
                    <Logo variant="large" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Workspace</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Welcome to the TimeLock SaaS Platform. Please select your role to proceed to the appropriate dashboard.
                </p>
            </div>

            <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
                {/* Super Admin Card */}
                <button
                    onClick={() => navigate('/super-admin')}
                    className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20"
                >
                    <div className="absolute top-6 right-6 p-2 bg-slate-900 rounded-lg border border-slate-700 group-hover:border-blue-500/30 transition-colors">
                        <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400" />
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-blue-900/30 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Shield className="w-8 h-8 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Login as Platform Owner</h2>
                    <p className="text-slate-400 mb-6">
                        Access the Super Admin "God Mode". Monitor global revenue, active tenants, and system health.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-900/50 py-2 px-3 rounded-lg w-fit">
                        <Lock className="w-3 h-3" />
                        Secure Access Only
                    </div>
                </button>

                {/* Client Admin Card */}
                <button
                    onClick={() => navigate('/tenant/ecosystem')}
                    className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/20"
                >
                    <div className="absolute top-6 right-6 p-2 bg-slate-900 rounded-lg border border-slate-700 group-hover:border-emerald-500/30 transition-colors">
                        <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400" />
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-emerald-900/30 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                        <School className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Login as Tenant (School/Hotel)</h2>
                    <p className="text-slate-400 mb-6">
                        Access the Tenant Ecosystem. Manage student attendance, SMS notifications, and billing.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-900/50 py-2 px-3 rounded-lg w-fit">
                        <Users className="w-3 h-3" />
                        Operational View
                    </div>
                </button>
            </div>

            <footer className="absolute bottom-6 text-slate-600 text-xs text-center w-full">
                © 2026 TimeLock Solutions. Secure Enterprise Access.
            </footer>
        </div>
    );
};

export default Landing;
