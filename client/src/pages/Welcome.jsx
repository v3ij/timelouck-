import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0A1F44] flex flex-col items-center justify-center p-6 font-sans text-center relative overflow-hidden">
            {/* Decorations */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1EC677]/5 to-transparent pointer-events-none"></div>

            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1EC677]/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center max-w-md w-full animate-fade-in-up">
                <div className="bg-white/10 p-8 rounded-[32px] mb-10 shadow-[0_0_50px_rgba(30,198,119,0.2)] ring-1 ring-white/20 animate-pulse-slow">
                    <Shield className="w-24 h-24 text-[#1EC677]" strokeWidth={1.5} />
                </div>

                <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Cortex</h1>
                <p className="text-blue-200/60 text-sm font-medium tracking-[0.3em] uppercase mb-12">Secure Access Ecosystem</p>

                <div className="space-y-4 w-full">
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-4 bg-[#1EC677] hover:bg-[#159c5d] text-[#0A1F44] font-bold rounded-2xl shadow-lg shadow-emerald-900/30 active:scale-[0.98] transition-all duration-300 text-lg"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 active:scale-[0.98] transition-all duration-300 text-lg"
                    >
                        Create Account
                    </button>
                </div>
            </div>

            <div className="absolute bottom-8">
                <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-bold">Powered By Team Africano</p>
            </div>
        </div>
    );
};

export default Welcome;
