import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Clock, Home, Bed, LogOut, Shield, Building2, Cpu } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isSchool = location.pathname.startsWith('/school');
    const isHotel = location.pathname.startsWith('/hotel');
    const isAdmin = location.pathname.startsWith('/superadmin');

    const handleLogout = () => {
        navigate('/');
    };

    let links = [];
    let brandSub = '';

    if (isSchool) {
        brandSub = 'School Portal';
        links = [
            { path: '/school/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/school/students', label: 'Students', icon: Users },
            { path: '/school/attendance', label: 'Attendance', icon: Clock },
        ];
    } else if (isHotel) {
        brandSub = 'Hotel Portal';
        links = [
            { path: '/hotel/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/hotel/rooms', label: 'Rooms', icon: Home },
            { path: '/hotel/guests', label: 'Guests', icon: Bed },
        ];
    } else if (isAdmin) {
        brandSub = 'Super Admin / Cortex SaaS';
        links = [
            { path: '/superadmin/dashboard', label: 'Global Overview', icon: Shield },
            { path: '/superadmin/hardware', label: 'Hardware Fleet', icon: Cpu },
            { path: '/superadmin/accounting', label: 'Accounting', icon: Building2 },
            { path: '/superadmin/logs', label: 'Audit Logs', icon: Clock },
            { path: '/superadmin/gov-portal', label: 'Gov Registry', icon: Users },
        ];
    }

    return (
        <div className="w-72 bg-[#0A1F44] h-screen flex flex-col shadow-2xl z-50">
            {/* Header */}
            <div className="h-24 flex items-center px-8 border-b border-white/10">
                <div>
                    <h1 className="font-bold text-2xl tracking-tighter text-white">TimeLock<span className="text-[#FFA500]">.</span></h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Powered by Cortex</p>
                    <div className="mt-2 inline-block px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-medium text-[#FFA500] uppercase tracking-wide">
                        {brandSub}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
                <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3.5 rounded-r-xl transition-all font-medium text-sm group ${isActive
                                ? 'bg-white/10 text-white border-l-4 border-[#FFA500] shadow-lg shadow-black/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                            }`
                        }
                    >
                        <link.icon size={20} className="group-hover:scale-110 transition-transform duration-300" />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-[#081835]">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all font-medium text-sm group"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
