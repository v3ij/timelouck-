import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Splash = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/welcome');
        }, 2500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#0A1F44] flex flex-col items-center justify-center font-sans">
            <div className="relative">
                <div className="w-24 h-24 bg-[#1EC677] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(30,198,119,0.4)] animate-scale-in">
                    <Lock className="w-12 h-12 text-[#0A1F44]" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-[#1EC677]/20 animate-ping-slow"></div>
            </div>

            <h1 className="mt-8 text-3xl font-bold text-white tracking-wider animate-pulse-slow">
                CORTEX<span className="text-[#1EC677]">.IO</span>
            </h1>
            <p className="text-white/40 text-sm mt-2 tracking-widest uppercase">Secure Access Systems</p>
        </div>
    );
};

export default Splash;
