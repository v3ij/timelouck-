import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, Users, History, CreditCard, LogOut, School } from 'lucide-react';

const TenantLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { icon: LayoutGrid, label: 'Ecosystem Map', path: '/tenant/ecosystem', active: location.pathname === '/tenant/ecosystem' },
        { icon: Users, label: 'Students', path: '/tenant/students', active: location.pathname === '/tenant/students' },
        { icon: History, label: 'Door Logs', path: '/tenant/logs', active: location.pathname === '/tenant/logs' },
        { icon: CreditCard, label: 'Financials', path: '/tenant/financials', active: location.pathname === '/tenant/financials' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex text-slate-800">
            {/* Sidebar - Light/Operational Theme */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-50">
                {/* Brand Header */}
                <div className="h-20 flex items-center px-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <School size={20} />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-900 leading-tight">Kampala High</h1>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Tenant Portal</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                if (item.path === '/tenant/ecosystem') {
                                    navigate(item.path);
                                } else {
                                    alert('Module Ready for API Binding');
                                }
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${item.active
                                    ? 'bg-blue-50 text-blue-700 font-bold'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon size={20} className={item.active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
                            <span className="text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* User Profile / Logout */}
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                    <div className="mt-4 text-center">
                        <p className="text-[10px] text-slate-400">TimeLock SaaS v2.4.0</p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 min-h-screen bg-slate-50">
                {children}
            </main>
        </div>
    );
};

export default TenantLayout;
