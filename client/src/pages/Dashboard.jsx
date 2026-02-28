import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Clock, QrCode, Fingerprint, Home, History as HistoryIcon, Wallet, User, Bell, Plus, CheckCircle, XCircle } from 'lucide-react';
import TopUpModal from '../components/TopUpModal';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(0);
    const [notification, setNotification] = useState('');
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);

    // Notification & Biometric State
    const [notificationsList, setNotificationsList] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isBiometricScanning, setIsBiometricScanning] = useState(false);

    const navigate = useNavigate();
    const notifRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            navigate('/login');
        } else {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setBalance(parsedUser.wallet_balance || 0);
            fetchBalance(token);
            fetchNotifications(token);
        }
    }, [navigate]);

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchBalance = async (token) => {
        try {
            const res = await axios.get('/api/wallet/balance', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBalance(res.data.balance);
        } catch (err) {
            console.error("Failed to fetch balance:", err);
        }
    };

    const fetchNotifications = async (token) => {
        try {
            const res = await axios.get('/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotificationsList(res.data.notifications);
            setUnreadCount(res.data.notifications.filter(n => !n.is_read).length);
        } catch (e) { console.error(e); }
    };

    const handleMarkRead = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update UI locally
            setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) { console.error(e); }
    };

    const handleUnlock = async () => {
        const token = localStorage.getItem('token');
        try {
            if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);

            setNotification('Requesting Unlock...');
            const res = await axios.post('/api/unlock', { doorId: 'DOOR_001' }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (window.navigator && window.navigator.vibrate) window.navigator.vibrate([50, 100, 50]);

            setNotification('Success: ' + res.data.message);
            setTimeout(() => setNotification(''), 3000);
        } catch (err) {
            console.error("Unlock failed:", err);
            setNotification('Failed to unlock door.');
            setTimeout(() => setNotification(''), 3000);
        }
    };

    const handleBiometric = async () => {
        setIsBiometricScanning(true);
        setNotification('Biometric Verification...');
        const token = localStorage.getItem('token');

        try {
            const res = await axios.post('/api/access/biometric', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (window.navigator && window.navigator.vibrate) window.navigator.vibrate([50, 50, 50]);
            setNotification(res.data.message);
        } catch (err) {
            setNotification('Authentication Failed');
        } finally {
            setIsBiometricScanning(false);
            setTimeout(() => setNotification(''), 3000);
        }
    };

    const handleTopUpSuccess = (amount) => {
        setBalance(prev => parseFloat(prev) + parseFloat(amount));
        setNotification(`Top Up Successful: +UGX ${amount.toLocaleString()}`);
        setTimeout(() => setNotification(''), 3000);
        // Refresh notifications as system usually sends one for payments
        const token = localStorage.getItem('token');
        if (token) fetchNotifications(token);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0A1F44] relative overflow-x-hidden font-sans tap-highlight-transparent pb-32">

            {/* Background Gradient Mesh */}
            <div className="fixed top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#1EC677]/10 to-transparent pointer-events-none"></div>

            {/* Header */}
            <div className="p-6 pt-[calc(1.5rem+var(--safe-top))] flex justify-between items-center relative z-20">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user.full_name}&background=0A1F44&color=fff&bold=true`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-blue-200/60 text-xs font-medium uppercase tracking-wider">Welcome</p>
                        <h2 className="text-white font-bold text-lg leading-tight">{user.full_name?.split(' ')[0]}</h2>
                    </div>
                </div>

                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
                    >
                        <Bell className="w-5 h-5 text-white" />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#0A1F44] rounded-full"></span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 top-12 w-80 bg-[#0F2955] border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
                            <div className="p-3 border-b border-white/5 flex justify-between items-center">
                                <h3 className="text-white text-xs font-bold">Notifications</h3>
                                <span className="text-white/40 text-[10px]">{unreadCount} new</span>
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                {notificationsList.length === 0 ? (
                                    <div className="p-4 text-center text-white/30 text-xs">No notifications</div>
                                ) : (
                                    notificationsList.map(n => (
                                        <div
                                            key={n.id}
                                            onClick={() => handleMarkRead(n.id)}
                                            className={`p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!n.is_read ? 'bg-white/5' : ''}`}
                                        >
                                            <div className="flex items-start gap-2">
                                                <div className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${!n.is_read ? 'bg-blue-400' : 'bg-transparent'}`}></div>
                                                <div>
                                                    <p className={`text-xs ${!n.is_read ? 'text-white font-medium' : 'text-white/60'}`}>{n.message}</p>
                                                    <p className="text-[10px] text-white/30 mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Balance Card */}
            <div className="px-6 mb-8 relative z-10 max-w-2xl mx-auto w-full">
                <div className="glass-card rounded-[28px] p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Wallet className="w-32 h-32 text-white transform rotate-[-15deg]" />
                    </div>
                    <div className="relative">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-blue-200/70 text-sm font-medium">Total Balance</p>
                            <div className="bg-[#1EC677]/20 border border-[#1EC677]/30 px-2.5 py-1 rounded-lg">
                                <p className="text-[#1EC677] text-[10px] font-bold tracking-wide uppercase">Active</p>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight mb-6">
                            UGX {parseFloat(balance).toLocaleString()}
                        </h1>
                        <div className="flex space-x-3">
                            <button onClick={() => setIsTopUpOpen(true)} className="flex-1 bg-white/10 hover:bg-white/20 active:scale-[0.98] transition-all py-3 rounded-xl flex items-center justify-center border border-white/5 shadow-lg">
                                <Plus className="w-4 h-4 text-white mr-1.5" />
                                <span className="text-white text-sm font-semibold">Top Up</span>
                            </button>
                            <button onClick={() => navigate('/history')} className="flex-1 bg-white/10 hover:bg-white/20 active:scale-[0.98] transition-all py-3 rounded-xl flex items-center justify-center border border-white/5 shadow-lg">
                                <HistoryIcon className="w-4 h-4 text-white mr-1.5" />
                                <span className="text-white text-sm font-semibold">History</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Banner */}
            {notification && (
                <div className="fixed top-[15%] left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-md border border-white/20 text-[#0A1F44] px-4 py-3 rounded-2xl shadow-2xl z-[60] text-center text-sm font-bold flex items-center justify-center space-x-2 animate-fade-in-up">
                    {notification.includes('Success') || notification.includes('Verified') ? <CheckCircle className="text-green-600 w-5 h-5" /> :
                        notification.includes('Failed') ? <XCircle className="text-red-500 w-5 h-5" /> : <div className="w-4 h-4 border-2 border-[#0A1F44] border-t-transparent rounded-full animate-spin"></div>}
                    <span>{notification}</span>
                </div>
            )}

            {/* Main Action Grid */}
            <div className="grid grid-cols-2 gap-4 px-6 mb-24 relative z-10 max-w-2xl mx-auto w-full">

                {/* Unlock Door */}
                <button
                    onClick={() => navigate('/unlock')}
                    className="aspect-[4/3] bg-gradient-to-br from-[#1EC677] to-[#159c5d] rounded-[24px] flex flex-col items-center justify-center shadow-lg shadow-emerald-900/20 active:scale-[0.97] transition-all duration-200 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="bg-white/20 p-4 rounded-full mb-3 shadow-inner ring-1 ring-white/30">
                        <Lock className="w-8 h-8 text-white drop-shadow-md" strokeWidth={2.5} />
                    </div>
                    <span className="text-white font-bold text-lg tracking-wide">Unlock</span>
                </button>

                {/* Buy Time */}
                <button
                    onClick={() => navigate('/buy-time')}
                    className="aspect-[4/3] bg-gradient-to-br from-[#FFA500] to-[#e69500] rounded-[24px] flex flex-col items-center justify-center shadow-lg shadow-orange-900/20 active:scale-[0.97] transition-all duration-200 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="bg-white/20 p-4 rounded-full mb-3 shadow-inner ring-1 ring-white/30">
                        <Clock className="w-8 h-8 text-white drop-shadow-md" strokeWidth={2.5} />
                    </div>
                    <span className="text-white font-bold text-lg tracking-wide">Buy Time</span>
                </button>

                {/* Scan QR */}
                <button
                    onClick={() => setNotification('Scanning...')}
                    className="aspect-[4/3] bg-white rounded-[24px] flex flex-col items-center justify-center shadow-lg shadow-black/10 active:scale-[0.97] transition-all duration-200 group"
                >
                    <div className="bg-blue-50 p-3.5 rounded-full mb-2 group-hover:scale-110 transition-transform duration-300 border border-blue-100">
                        <QrCode className="w-7 h-7 text-blue-600" strokeWidth={2} />
                    </div>
                    <span className="text-[#0A1F44] font-bold text-sm">Scan QR</span>
                </button>

                {/* Biometric */}
                <button
                    onClick={handleBiometric}
                    disabled={isBiometricScanning}
                    className="aspect-[4/3] bg-white rounded-[24px] flex flex-col items-center justify-center shadow-lg shadow-black/10 active:scale-[0.97] transition-all duration-200 group"
                >
                    <div className={`bg-cyan-50 p-3.5 rounded-full mb-2 group-hover:scale-110 transition-transform duration-300 border border-cyan-100 ${isBiometricScanning ? 'animate-pulse' : ''}`}>
                        <Fingerprint className={`w-7 h-7 text-cyan-500 ${isBiometricScanning ? 'animate-pulse' : ''}`} strokeWidth={2} />
                    </div>
                    <span className="text-[#0A1F44] font-bold text-sm">
                        {isBiometricScanning ? 'Scanning...' : 'Biometric'}
                    </span>
                </button>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 w-full bg-[#0A1F44]/95 backdrop-blur-md border-t border-white/5 flex justify-around items-start pt-3 pb-[calc(10px+var(--safe-bottom))] px-6 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
                <NavIcon icon={<Home size={24} />} label="Home" active />
                <NavIcon icon={<HistoryIcon size={24} />} label="History" onClick={() => navigate('/history')} />
                <NavIcon icon={<Wallet size={24} />} label="Wallet" onClick={() => navigate('/wallet')} />
                <NavIcon icon={<User size={24} />} label="Profile" onClick={() => navigate('/profile')} />
            </div>

            <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} onSuccess={handleTopUpSuccess} />
        </div>
    );
};

const NavIcon = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center space-y-1 w-16 group ${active ? 'text-white' : 'text-gray-500 hover:text-white transition-colors'}`}
    >
        <div className={`p-1.5 rounded-xl transition-all duration-300 ${active ? 'bg-white/10' : 'group-hover:bg-white/5'}`}>
            {icon}
        </div>
        <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
);

export default Dashboard;
