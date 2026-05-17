import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Lock, LogOut, TrendingUp,
    Activity, Zap, Search, Bell, Settings, MoreHorizontal, Wallet, Home, AlertCircle, FileText
} from 'lucide-react';

import Logo from '../components/Logo';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalRevenue: 0, activeLocks: 0, totalUsers: 0 });
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Linking Device State
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [availableContracts, setAvailableContracts] = useState([]);
    const [selectedContractId, setSelectedContractId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const storedUser = JSON.parse(localStorage.getItem('user'));

                if (!token || !storedUser) { navigate('/login'); return; }

                // Using our new dynamic tenant stats endpoint
                // Fallback to tenantId 1 for testing if not set correctly in user session
                const tenantId = storedUser.tenant_id || 1;

                const res = await fetch(`/api/admin/tenant/${tenantId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setStats(data.data); // data.data contains our industry_type and stats
                    // Mocking devices explicitly to show the link button 
                    setDevices([
                        { id: 101, device_name: 'Main Gate', model: 'Timmy TL90', location: 'Entrance', online_status: true },
                        { id: 102, device_name: 'Room 402 Lock', model: 'Timmy TL90', location: '4th Floor', online_status: false }
                    ]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const handleOpenLinkModal = async (device) => {
        setSelectedDevice(device);
        setIsLinkModalOpen(true);
        // Mock fetch available contracts for this tenant
        setAvailableContracts([
            { id: 1, name: 'Room 402 (Active Stay)', type: 'hotel_stay' },
            { id: 2, name: 'Apt 5B (Active Lease)', type: 'apartment_lease' }
        ]);
        setSelectedContractId('1');
    };

    const handleLinkDevice = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/devices/link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ device_id: selectedDevice.id, contract_id: selectedContractId })
            });
            const data = await res.json();
            if (data.status === 'success') {
                alert(`Successfully linked ${selectedDevice.device_name} to unit.`);
                setIsLinkModalOpen(false);
            } else {
                alert(data.message || 'Failed to link device');
            }
        } catch (err) {
            alert('Error linking device');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) return <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center text-[#0A1F44]">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#F4F6F9] font-sans text-slate-800 flex">

            {/* Sidebar */}
            <aside className="w-64 bg-[#0A1F44] text-white fixed h-full hidden lg:flex flex-col p-6">
                {/* Replaced Icon Header with Logo Component */}
                <div className="mb-12">
                    <Logo />
                </div>

                <nav className="space-y-2 flex-1">
                    <NavItem icon={LayoutDashboard} label="Dashboard" path="/admin" active />
                    <NavItem icon={Users} label="User Management" path="/admin/users" />
                    <NavItem icon={Lock} label="Smart Locks" path="/admin/locks" />
                    <NavItem icon={Activity} label="Access Logs" path="/admin/logs" />
                    <NavItem icon={TrendingUp} label="Financials" path="/admin/finance" />
                    <NavItem icon={Settings} label="System Settings" path="/admin/settings" />
                </nav>

                <button onClick={handleLogout} className="flex items-center gap-3 text-red-300 hover:text-red-100 transition-colors mt-auto p-3">
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 flex-1 p-8">

                {/* Top Bar */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0A1F44]">Dashboard Overview</h2>
                        <p className="text-slate-500 text-sm">Welcome back, Administrator</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA500] w-64"
                            />
                        </div>
                        <button className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="w-10 h-10 bg-[#0A1F44] rounded-full flex items-center justify-center text-white font-bold">
                            AD
                        </div>
                    </div>
                </header>

                {/* DYNAMIC KPI Cards based on Industry Type */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                    {stats.industry_type === 'school' ? (
                        <>
                            <KPICard title="Total Students" value={stats.totalStudents || 0} icon={Users} stripColor="bg-blue-500" />
                            <KPICard title="Daily Attendance" value={stats.dailyAttendance || 0} icon={Activity} stripColor="bg-[#1EC677]" />
                            <KPICard title="Total Balance" value={`UGX ${(stats.totalBalance || 0).toLocaleString()}`} icon={Wallet} stripColor="bg-[#FFA500]" />
                        </>
                    ) : stats.industry_type === 'hotel' ? (
                        <>
                            <KPICard title="Booked Rooms" value={stats.bookedRooms || 0} icon={Home} stripColor="bg-amber-500" />
                            <KPICard title="Active Guests" value={stats.activeGuests || 0} icon={Users} stripColor="bg-purple-500" />
                            <KPICard title="Unrecovered Items" value={stats.unrecoveredLostItems || 0} icon={AlertCircle} stripColor="bg-red-500" />
                        </>
                    ) : stats.industry_type === 'apartment' ? (
                        <>
                            <KPICard title="Active Leases" value={stats.activeLeases || 0} icon={FileText} stripColor="bg-emerald-500" />
                            <KPICard title="Rent Collection" value={`UGX ${(stats.rentCollection || 0).toLocaleString()}`} icon={Wallet} stripColor="bg-[#FFA500]" />
                            <KPICard title="Active Locks" value={stats.activeLocks || 0} icon={Lock} stripColor="bg-[#1EC677]" />
                        </>
                    ) : (
                        /* Default Generic Rendering if type is undefined */
                        <>
                            <KPICard title="Total Revenue" value={`UGX ${(stats.totalBalance || 0).toLocaleString()}`} icon={TrendingUp} stripColor="bg-[#FFA500]" />
                            <KPICard title="Active Locks" value={stats.activeLocks || 0} icon={Lock} stripColor="bg-[#1EC677]" />
                            <KPICard title="Total Users" value={(stats.totalUsers || 0).toLocaleString()} icon={Users} stripColor="bg-blue-500" />
                        </>
                    )}
                </div>

                {/* Door Management Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-[#0A1F44] text-lg">Door Management</h3>
                        <button className="text-sm font-medium text-[#FFA500] hover:text-orange-600">View All</button>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="px-6 py-4">Visual</th>
                                <th className="px-6 py-4">Device Name</th>
                                <th className="px-6 py-4">Model</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {devices.map((device, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    {/* Visual Column */}
                                    <td className="px-6 py-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${device.online_status ? 'bg-green-100' : 'bg-slate-100'}`}>
                                            {/* Smart Lock Handle SVG */}
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={device.online_status ? "#1EC677" : "#94A3B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="8" y="2" width="8" height="20" rx="2" />
                                                <circle cx="12" cy="14" r="2" />
                                                <path d="M12 12V14" />
                                            </svg>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-[#0A1F44]">{device.device_name}</td>
                                    <td className="px-6 py-4 text-slate-500">{device.model || 'N/A'}</td>
                                    <td className="px-6 py-4 text-slate-500">{device.location}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${device.online_status
                                            ? 'bg-[#1EC677]/10 text-[#1EC677]'
                                            : 'bg-red-500/10 text-red-500'
                                            }`}>
                                            {device.online_status ? 'ONLINE' : 'OFFLINE'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => handleOpenLinkModal(device)}
                                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            Link to Unit
                                        </button>
                                        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-[#0A1F44]">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {devices.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400 italic">No devices found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Link Device Modal */}
            {isLinkModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold text-[#0A1F44] mb-2">Link Device to Unit</h2>
                        <p className="text-slate-500 text-sm mb-4">Select an active contract/booking to assign to <strong className="text-slate-800">{selectedDevice?.device_name}</strong>.</p>

                        <form onSubmit={handleLinkDevice} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Unit (Room/Apartment/Class)</label>
                                <select
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A1F44] focus:outline-none"
                                    value={selectedContractId}
                                    onChange={(e) => setSelectedContractId(e.target.value)}
                                >
                                    {availableContracts.map(contract => (
                                        <option key={contract.id} value={contract.id}>{contract.name} - {contract.type}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsLinkModalOpen(false)}
                                    className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#0A1F44] hover:bg-blue-900 text-white rounded-xl font-bold transition-colors"
                                >
                                    Link Device
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const NavItem = ({ icon: Icon, label, path, active }) => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(path)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left ${active
                ? 'bg-[#FFA500] text-[#0A1F44] font-bold shadow-lg shadow-orange-500/20'
                : 'text-blue-100 hover:bg-white/10'
                }`}>
            <Icon size={20} />
            <span>{label}</span>
        </button>
    );
};

const KPICard = ({ title, value, icon: Icon, stripColor }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center relative overflow-hidden group hover:shadow-md transition-all">
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${stripColor}`}></div>
        <div className="p-3 bg-slate-50 rounded-xl mr-5 group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-[#0A1F44]" />
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-[#0A1F44]">{value}</h3>
        </div>
    </div>
);

export default AdminDashboard;
