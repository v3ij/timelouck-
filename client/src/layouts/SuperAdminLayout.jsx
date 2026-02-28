import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const SuperAdminLayout = () => {
    return (
        <div className="flex bg-slate-50 min-h-screen font-sans">
            <Sidebar />
            <div className="flex-1 ml-64 min-h-screen">
                <Outlet />
            </div>
        </div>
    );
};

export default SuperAdminLayout;
