import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await axios.post('/api/forgot-password', { email });
            setStatus({ type: 'success', message: res.data.message });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to send link' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A1F44] relative overflow-hidden font-sans tap-highlight-transparent flex flex-col justify-center px-8 pb-10">
            {/* Background Gradient Mesh */}
            <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-[#0A1F44] via-[#0F2955] to-[#0A1F44] z-0"></div>
            <div className="fixed top-0 right-0 w-[300px] h-[300px] bg-[#1EC677]/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md mx-auto animate-fade-in-up">
                {/* Header */}
                <div className="mb-4">
                    <button onClick={() => navigate('/login')} className="flex items-center text-blue-200/60 hover:text-white transition-colors group">
                        <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Login</span>
                    </button>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                    <p className="text-blue-200/60 text-sm leading-relaxed">Enter your registered email address. We'll send you a secure link to reset your password.</p>
                </div>

                {status.message && (
                    <div className={`px-4 py-3 rounded-2xl mb-8 text-xs text-center font-medium flex items-center justify-center gap-2 ${status.type === 'success' ? 'bg-[#1EC677]/10 text-[#1EC677] border border-[#1EC677]/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.type === 'success' ? 'bg-[#1EC677]' : 'bg-red-400'}`}></span>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-blue-200/50 ml-4 uppercase tracking-wider">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="text-blue-300/50 w-5 h-5 group-focus-within:text-[#1EC677] transition-colors" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                placeholder="name@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-blue-200/20 focus:outline-none focus:bg-white/10 focus:border-[#1EC677]/50 focus:ring-1 focus:ring-[#1EC677]/50 transition-all text-[15px]"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#1EC677] to-[#159c5d] hover:brightness-110 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-900/30 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 mt-4 flex justify-center items-center space-x-2 text-[16px]"
                    >
                        {isLoading ? <span>Sending...</span> : (
                            <>
                                <span>Send Reset Link</span>
                                <Send className="w-4 h-4 opacity-80" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
