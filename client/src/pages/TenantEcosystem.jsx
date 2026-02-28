import React from 'react';
import Sidebar from '../components/Sidebar';
import EcosystemMap from './Tenant/EcosystemMap';

const TenantEcosystem = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans flex">
            {/* Integrated Smart Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 ml-64 bg-slate-50">
                <EcosystemMap />
            </main>
        </div>
    );
};

export default TenantEcosystem;
