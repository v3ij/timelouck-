import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        role: 'User'
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/register', formData);
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error);
            alert('Registration failed: ' + (error.response?.data?.message || 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
            {/* Phone Body */}
            <div className="w-full max-w-[375px] h-[812px] bg-[#0A1F44] relative rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-gray-800 ring-2 ring-gray-700 flex flex-col justify-center px-8">

                {/* Status Bar */}
                <div className="absolute top-0 left-0 w-full h-8 bg-transparent flex justify-between px-6 items-center text-white/50 text-xs font-bold">
                    <span>9:41</span>
                    <div className="flex space-x-1">
                        <div className="w-4 h-2.5 bg-current rounded-sm"></div>
                        <div className="w-3 h-2.5 bg-current rounded-sm"></div>
                    </div>
                </div>

                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
                    <p className="text-gray-400 text-xs">Join Cortex Security</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-gray-400 mb-1 text-[10px] ml-1 uppercase tracking-wide">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 text-gray-500 w-4 h-4" />
                            <input
                                type="text"
                                name="fullName"
                                placeholder="John Doe"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#1EC677] transition-all text-sm"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-1 text-[10px] ml-1 uppercase tracking-wide">Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-3.5 text-gray-500 w-4 h-4" />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="+1234567890"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#1EC677] transition-all text-sm"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-1 text-[10px] ml-1 uppercase tracking-wide">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-gray-500 w-4 h-4" />
                            <input
                                type="email"
                                name="email"
                                placeholder="john@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#1EC677] transition-all text-sm"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-1 text-[10px] ml-1 uppercase tracking-wide">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-gray-500 w-4 h-4" />
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#1EC677] transition-all text-sm"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#1EC677] hover:bg-green-500 text-[#0A1F44] font-bold py-4 rounded-xl shadow-lg shadow-green-900/20 transition-all transform active:scale-95 disabled:opacity-50 mt-2"
                    >
                        {isLoading ? 'Creating...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400 text-xs">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#1EC677] font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
