import React, { useState } from 'react';
import { ShieldAlert, Server, Activity, Database, Key } from 'lucide-react';

import PageHeader from '../../components/PageHeader';

const mockLogs = [
    { id: '1', time: '10:45 AM', type: 'AUTH', action: 'Failed Login Attempt', user: 'unknown@ip', status: 'WARN' },
    { id: '2', time: '10:42 AM', type: 'SYSTEM', action: 'DBSync - 1500 records updated', user: 'system', status: 'OK' },
    { id: '3', time: '09:12 AM', type: 'HARDWARE', action: 'Device TL90-Nairobi Offline', user: 'system', status: 'ERROR' },
    { id: '4', time: '08:00 AM', type: 'CRON', action: 'Time Wallet Deduction Cycle Complete', user: 'system', status: 'OK' },
    { id: '5', time: '07:55 AM', type: 'ADMIN', action: 'Global Top-up Event Triggered', user: 'owner@company.com', status: 'WARN' },
];

const AuditLogs = () => {
    return (
        <div className="font-sans space-y-6">
            <PageHeader title="Global Audit Logs" description="System-wide security monitoring and tracking." />

            <div className="bg-[#0A1F44] p-6 rounded-2xl shadow-xl border border-white/10 text-white font-mono text-sm">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                    <Activity className="text-emerald-400" size={20} />
                    <span className="font-bold flex-1">Live Feed Pipeline [ACTIVE]</span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">WebSocket Connected</span>
                </div>

                <div className="space-y-3">
                    {mockLogs.map(log => (
                        <div key={log.id} className="flex items-center gap-4 p-2 hover:bg-white/5 rounded transition-colors">
                            <span className="text-slate-400 min-w-[80px]">{log.time}</span>

                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold w-20 text-center ${log.type === 'AUTH' ? 'bg-orange-500/20 text-orange-300' :
                                log.type === 'SYSTEM' ? 'bg-blue-500/20 text-blue-300' :
                                    log.type === 'HARDWARE' ? 'bg-red-500/20 text-red-300' :
                                        'bg-purple-500/20 text-purple-300'
                                }`}>
                                {log.type}
                            </span>

                            <span className={`w-16 text-center text-[10px] font-bold border border-current rounded ${log.status === 'OK' ? 'text-emerald-400' :
                                log.status === 'WARN' ? 'text-orange-400' : 'text-red-400'
                                }`}>
                                {log.status}
                            </span>

                            <span className="flex-1 text-slate-200">{log.action}</span>
                            <span className="text-slate-500 hidden md:block">[{log.user}]</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
