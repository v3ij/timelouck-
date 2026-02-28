import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, Mail, Phone, LogOut, ChevronRight, Shield, Fingerprint, Activity } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setBiometricEnabled(parsed.biometric_enabled);
        }
    }, []);

    const toggleBiometric = async () => {
        const newValue = !biometricEnabled;
        setBiometricEnabled(newValue); // Optimistic UI
        const token = localStorage.getItem('token');

        try {
            const res = await axios.put('/api/user/profile', { biometric_enabled: newValue }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update local storage user
            const updatedUser = res.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (err) {
            console.error(err);
            setBiometricEnabled(!newValue); // Revert
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black/90 flex items-center justify-center p-4 font-sans tap-highlight-transparent">
            <div className="w-full max-w-[375px] h-[812px] bg-[#0A1F44] relative rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-gray-800 ring-4 ring-gray-900 flex flex-col animate-scale-in">

                {/* Header */}
                <div className="p-6 pt-12 flex items-center space-x-4 bg-[#0A1F44] z-10 sticky top-0">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/10 rounded-full transition text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-white">My Profile</h1>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-20">

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 rounded-full border-4 border-white/10 overflow-hidden shadow-xl mb-4 relative">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user.full_name}&background=1EC677&color=fff&bold=true`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-white">{user.full_name}</h2>
                        <p className="text-blue-200/60 text-sm">Premium Member</p>
                    </div>

                    {/* Info Card */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-6 space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-white/5 rounded-lg">
                                <Mail className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                                <p className="text-white text-sm truncate">{user.email}</p>
                            </div>
                        </div>
                        <div className="w-full h-px bg-white/5"></div>
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-white/5 rounded-lg">
                                <Phone className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Phone</p>
                                <p className="text-white text-sm">{user.phone || '+256 700 000000'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Settings Actions */}
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 ml-2">Settings</h3>
                    <div className="space-y-3">
                        <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-[#1EC677]/10 text-[#1EC677] rounded-lg">
                                    <Fingerprint className="w-5 h-5" />
                                </div>
                                <span className="text-white font-medium">Biometric Access</span>
                            </div>
                            <button
                                onClick={toggleBiometric}
                                className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${biometricEnabled ? 'bg-[#1EC677]' : 'bg-gray-600'}`}
                            >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md ${biometricEnabled ? 'left-6' : 'left-1'}`}></div>
                            </button>
                        </div>

                        <button
                            onClick={() => navigate('/subscriptions')}
                            className="w-full bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-4 flex items-center justify-between transition-colors group">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <span className="text-white font-medium">My Subscriptions</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                        </button>

                        <button className="w-full bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-4 flex items-center justify-between transition-colors group">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <span className="text-white font-medium">Security & Privacy</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full bg-white/5 hover:bg-red-500/10 border border-white/5 rounded-2xl p-4 flex items-center justify-between transition-colors group"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-red-500/10 text-red-400 rounded-lg group-hover:bg-red-500/20 transition-colors">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <span className="text-red-400 font-medium">Log Out</span>
                            </div>
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600 text-xs">Cortex App v1.2.0 (Build 504)</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
