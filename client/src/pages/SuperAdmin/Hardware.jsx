import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { Cpu, Wifi, WifiOff, MapPin, RefreshCcw } from 'lucide-react';
import { showToast } from '../../components/GlobalToast';

const mockDevices = [
    { id: 'dev_01', name: 'Main Gate TL90', tenant: 'Test School', status: 'online', battery: '98%', location: 'Block A Entry' },
    { id: 'dev_02', name: 'Room 101 Access', tenant: 'Test Hotel', status: 'offline', battery: '12%', location: 'First Floor' },
    { id: 'dev_03', name: 'Top-up Kiosk Mini', tenant: 'Campus ATM', status: 'online', battery: 'AC Power', location: 'Cafeteria' },
];

const Hardware = () => {
    const [isPinging, setIsPinging] = useState(false);

    const handlePing = () => {
        setIsPinging(true);
        showToast('Pinging all IoT nodes...');
        setTimeout(() => setIsPinging(false), 2000);
    };

    return (
        <div className="font-sans space-y-8">
            <PageHeader title="Hardware & IoT Fleet" description="Monitor Timmy TL90 locks and smart kiosks globally.">
                <button
                    onClick={handlePing}
                    disabled={isPinging}
                    className="flex items-center gap-2 bg-white border border-gray-200 text-[#0A1F44] hover:bg-gray-50 px-4 py-2 rounded-xl transition-all duration-200 font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                    <RefreshCcw size={18} className={isPinging ? "animate-spin" : ""} />
                    Ping Fleet
                </button>
            </PageHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockDevices.map(device => (
                    <div key={device.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">

                        {/* Status Bar */}
                        <div className={`absolute top-0 left-0 w-full h-1 ${device.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl transition-colors ${device.status === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                <Cpu size={24} />
                            </div>
                            <span className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full ring-1 shadow-sm transition-all ${device.status === 'online' ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-red-500/10 text-red-600 ring-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]'}`}>
                                {device.status === 'online' ? <Wifi size={12} /> : <WifiOff size={12} />}
                                {device.status}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-[#0A1F44] mb-1">{device.name}</h3>
                        <p className="text-sm text-gray-500 font-medium mb-4">Node ID: <span className="font-mono text-xs">{device.id}</span></p>

                        <div className="space-y-2 mt-4 pt-4 border-t border-gray-100/60">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Tenant:</span>
                                <span className="font-semibold text-gray-800">{device.tenant}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Power:</span>
                                <span className={`font-semibold ${device.battery.includes('%') && parseInt(device.battery) < 20 ? 'text-red-500' : 'text-emerald-600'}`}>
                                    {device.battery}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-blue-600 bg-blue-50 w-max px-2 py-1 rounded">
                                <MapPin size={12} /> {device.location}
                            </div>
                        </div>

                        {/* Action Overlay */}
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                            <button onClick={() => showToast('Reboot command sent to node')} className="w-3/4 py-2 bg-[#0A1F44] text-white text-sm font-bold rounded-lg shadow-md hover:bg-blue-900 transition-colors">Remote Reboot</button>
                            <button onClick={() => showToast('Opening configuration interface')} className="w-3/4 py-2 bg-gray-100 text-[#0A1F44] text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors">Configure</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hardware;
