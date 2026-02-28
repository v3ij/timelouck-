import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const UserLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isHome = location.pathname === '/user/home';
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans flex justify-center">
            <div className="w-full max-w-md bg-slate-900 min-h-screen shadow-2xl relative">
                {/* Header */}
                <div className="p-6 flex justify-between items-center border-b border-white/10 min-h-[80px]">
                    <div>
                        {isHome ? (
                            <>
                                <h1 className="text-lg font-bold">TimeLock Access</h1>
                                <p className="text-xs text-slate-400">User Portal</p>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                            >
                                <ChevronLeft size={24} />
                                <span className="font-semibold text-lg">Back</span>
                            </button>
                        )}
                    </div>
                    {isHome && (
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">
                            U
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    <Outlet />
                </div>

                {/* Bottom Nav Placeholder (Optional) */}
            </div>
        </div>
    );
};

export default UserLayout;
