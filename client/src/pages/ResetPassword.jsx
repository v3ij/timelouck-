import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Key, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const email = searchParams.get('email');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setStatus({ type: 'error', message: 'Passwords do not match' });
            return;
        }

        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await axios.post('/api/reset-password', {
                email,
                newPassword: passwords.new
            });
            setStatus({ type: 'success', message: 'Password reset successful!' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setStatus({ type: 'error', message: 'Failed to reset password' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black/90 flex items-center justify-center p-4 font-sans tap-highlight-transparent">
            <div className="w-full max-w-[375px] h-[812px] bg-gradient-to-b from-[#0A1F44] to-[#051025] relative rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-gray-800 ring-4 ring-gray-900 flex flex-col justify-center px-8 animate-scale-in">

                <div className="mb-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-[#1EC677]/20 rounded-full flex items-center justify-center mb-4">
                        <Key className="w-8 h-8 text-[#1EC677]" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">New Password</h1>
                    <p className="text-blue-200/60 text-sm">Create a new secure password.</p>
                </div>

                {status.message && (
                    <div className={`px-4 py-3 rounded-2xl mb-6 text-xs text-center font-medium ${status.type === 'success' ? 'bg-[#1EC677]/10 text-[#1EC677]' : 'bg-red-500/10 text-red-400'}`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            placeholder="New Password"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white placeholder-blue-200/30 focus:outline-none focus:border-[#1EC677]/50 transition-all text-[15px]"
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white placeholder-blue-200/30 focus:outline-none focus:border-[#1EC677]/50 transition-all text-[15px]"
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#1EC677] hover:bg-[#159c5d] text-white font-bold py-4 rounded-2xl shadow-lg transition-all duration-300 transform active:scale-95 disabled:opacity-50 mt-4"
                    >
                        {isLoading ? 'Resetting...' : 'Set Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
