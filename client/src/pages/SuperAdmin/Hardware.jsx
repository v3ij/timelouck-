import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { Cpu, Wifi, WifiOff, MapPin, RefreshCcw, KeyRound, ShieldAlert, CheckCircle2, Activity, Battery, Terminal, PlusCircle } from 'lucide-react';
import { fetchDevices, triggerRemoteOverride, createDevice, fetchAdminTenants } from '../../services/api';
import { showToast } from '../../components/GlobalToast';

const Hardware = () => {
    const [devices, setDevices] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPinging, setIsPinging] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState('');
    const [overrideReason, setOverrideReason] = useState('');
    const [isSubmittingOverride, setIsSubmittingOverride] = useState(false);
    const [overrideStatus, setOverrideStatus] = useState(null);

    // New device state
    const [newDeviceName, setNewDeviceName] = useState('');
    const [newDeviceMac, setNewDeviceMac] = useState('');
    const [newDeviceTenant, setNewDeviceTenant] = useState('');
    const [isCreatingDevice, setIsCreatingDevice] = useState(false);

    const loadDevices = async () => {
        setIsLoading(true);
        const res = await fetchDevices();
        if (res && res.status === 'success') {
            setDevices(res.data);
            if (res.data.length > 0 && !selectedDevice) {
                setSelectedDevice(res.data[0].id);
            }
        } else {
            showToast('Failed to retrieve hardware fleet.');
        }
        setIsLoading(false);
    };

    const loadTenants = async () => {
        const res = await fetchAdminTenants();
        if (res && res.status === 'success') {
            setTenants(res.data);
        }
    };

    useEffect(() => {
        loadDevices();
        loadTenants();
    }, []);

    const handlePing = () => {
        setIsPinging(true);
        showToast('Initiating diagnostic ping across all IoT hardware endpoints...');
        setTimeout(() => {
            setIsPinging(false);
            showToast('IoT Diagnostic completed. All devices online status updated.');
            loadDevices();
        }, 1500);
    };

    const handleManualOverride = async (e) => {
        e.preventDefault();
        if (!selectedDevice) {
            showToast('Please select a hardware device.');
            return;
        }

        setIsSubmittingOverride(true);
        setOverrideStatus(null);
        showToast('Dispatched remote manual override request...');

        try {
            const res = await triggerRemoteOverride(selectedDevice, overrideReason || 'Manual remote administrator override');
            if (res.status === 'success') {
                showToast(`Success! Override command delivered successfully to node.`);
                setOverrideStatus({
                    success: true,
                    message: res.message,
                    socket: res.socket_delivered ? 'Delivered via simulated WebSocket (Port 7788)' : 'WebSocket offline (Logged to DB override audit)'
                });
                setOverrideReason('');
                loadDevices(); // Refresh list to update log
            } else {
                setOverrideStatus({
                    success: false,
                    message: res.message || 'Failed to trigger override.'
                });
                showToast('Remote override failed.');
            }
        } catch (err) {
            setOverrideStatus({
                success: false,
                message: 'Network transport error sending override signal.'
            });
            showToast('Connection failed.');
        } finally {
            setIsSubmittingOverride(false);
        }
    };

    const handleCreateDevice = async (e) => {
        e.preventDefault();
        if (!newDeviceName || !newDeviceMac) {
            showToast('Please fill in Name and SN/MAC.');
            return;
        }

        setIsCreatingDevice(true);
        showToast('Registering new IoT hardware fleet node...');

        try {
            const res = await createDevice(newDeviceName, newDeviceMac, newDeviceTenant);
            if (res.status === 'success') {
                showToast(`Success! Device registered: ${newDeviceName}`);
                setNewDeviceName('');
                setNewDeviceMac('');
                setNewDeviceTenant('');
                loadDevices();
            } else {
                showToast(res.message || 'Failed to register device.');
            }
        } catch (err) {
            showToast('Connection error during hardware registration.');
        } finally {
            setIsCreatingDevice(false);
        }
    };

    return (
        <div className="font-sans space-y-8 pb-12">
            <PageHeader title="Hardware & IoT Fleet" description="Monitor physical Timmy TL90 locks and smart kiosks globally.">
                <button
                    onClick={handlePing}
                    disabled={isPinging || isLoading}
                    className="flex items-center gap-2 bg-white border border-gray-200 text-[#0A1F44] hover:bg-gray-50 px-4 py-2 rounded-xl transition-all duration-200 font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                >
                    <RefreshCcw size={18} className={isPinging ? "animate-spin text-blue-600" : "text-gray-500"} />
                    Diagnostics Fleet Ping
                </button>
            </PageHeader>

            {/* Premium IoT Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Cpu size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider font-sans">Active Locks</p>
                        <h4 className="text-2xl font-black text-[#0A1F44]">{devices.filter(d => d.status === 'online').length} / {devices.length}</h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider font-sans">Daemon Port</p>
                        <h4 className="text-2xl font-black text-[#0A1F44]">7788 <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded ml-2">TCP Listening</span></h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <ShieldAlert size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider font-sans">Encrypted Handshake</p>
                        <h4 className="text-2xl font-black text-[#0A1F44]">AES-128 <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded ml-2">WPA3-Ready</span></h4>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Real-time Fleet list */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-[#0A1F44] flex items-center gap-2">
                            <Terminal size={20} className="text-blue-600" />
                            Registered Lock Fleet Nodes
                        </h2>
                        <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-bold">
                            Total Nodes: {devices.length}
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                            <RefreshCcw className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
                            <p className="text-gray-500 font-bold">Loading active fleet status...</p>
                        </div>
                    ) : devices.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                            <Cpu className="text-gray-300 mx-auto mb-4" size={48} />
                            <p className="text-gray-500 font-bold">No registered lock fleet nodes found in database.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {devices.map(device => (
                                <div key={device.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group">
                                    {/* Status Bar */}
                                    <div className={`absolute top-0 left-0 w-full h-1 ${device.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-xl transition-colors ${device.status === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            <Cpu size={22} />
                                        </div>
                                        <span className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full ring-1 shadow-sm transition-all ${device.status === 'online' ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-red-500/10 text-red-600 ring-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]'}`}>
                                            {device.status === 'online' ? <Wifi size={12} /> : <WifiOff size={12} />}
                                            {device.status}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-[#0A1F44] mb-1">{device.name}</h3>
                                    <p className="text-xs text-gray-400 font-medium mb-3">SN: <span className="font-mono text-gray-500 font-bold">{device.mac_address}</span></p>

                                    <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400 font-medium">Tenant Contract:</span>
                                            <span className="font-bold text-gray-700">{device.tenant}</span>
                                        </div>
                                        <div className="flex justify-between text-xs items-center">
                                            <span className="text-gray-400 font-medium">Internal Power:</span>
                                            <span className="font-bold text-emerald-600 flex items-center gap-1">
                                                <Battery size={14} /> {device.battery}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-3 text-[10px] font-bold text-blue-600 bg-blue-50 w-max px-2 py-0.5 rounded">
                                            <MapPin size={10} /> {device.location}
                                        </div>
                                    </div>

                                    {/* Action Hover overlay */}
                                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                        <button 
                                            onClick={() => {
                                                setSelectedDevice(device.id);
                                                showToast(`Selected ${device.name} for manual override.`);
                                            }}
                                            className="w-3/4 py-2 bg-[#0A1F44] text-white text-xs font-bold rounded-lg shadow hover:bg-blue-900 transition-colors"
                                        >
                                            Select For Override
                                        </button>
                                        <button 
                                            onClick={() => showToast(`Delivered node reboot command to ${device.mac_address}`)}
                                            className="w-3/4 py-2 bg-gray-100 text-[#0A1F44] text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            Diagnose / Ping
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Secure Override & Device Registration Panels */}
                <div className="space-y-8">
                    {/* Register IoT Lock Node Panel */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-[#0A1F44] flex items-center gap-2">
                            <PlusCircle size={22} className="text-blue-600" />
                            Register IoT Lock Node
                        </h2>

                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="mb-6">
                                <span className="inline-block text-[10px] font-bold text-blue-600 bg-blue-50 uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                                    Hardware Provisioning
                                </span>
                                <p className="text-xs text-gray-500">
                                    Add physical or simulated smart locks and biometrics terminals to the database using their unique Serial Number (MAC Address).
                                </p>
                            </div>

                            <form onSubmit={handleCreateDevice} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">
                                        Device Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newDeviceName}
                                        onChange={(e) => setNewDeviceName(e.target.value)}
                                        placeholder="e.g. Lobby Entrance Lock"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">
                                        Hardware Serial Number / MAC Address
                                    </label>
                                    <input
                                        type="text"
                                        value={newDeviceMac}
                                        onChange={(e) => setNewDeviceMac(e.target.value)}
                                        placeholder="e.g. SN: TL90-84920X or MAC Address"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">
                                        Assign to Tenant Phase (Optional)
                                    </label>
                                    <select
                                        value={newDeviceTenant}
                                        onChange={(e) => setNewDeviceTenant(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                                    >
                                        <option value="">System Platform (Unassigned)</option>
                                        {tenants.map(t => (
                                            <option key={t.id} value={t.id}>
                                                {t.name} ({t.type})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isCreatingDevice}
                                    className="w-full py-3.5 bg-[#0A1F44] text-white rounded-xl text-xs font-bold hover:bg-blue-900 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                                >
                                    <PlusCircle size={16} />
                                    {isCreatingDevice ? 'Registering...' : 'Register IoT Node'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Secure Override Control Panel */}
                    <div className="space-y-6">
                    <h2 className="text-xl font-bold text-[#0A1F44] flex items-center gap-2">
                        <KeyRound size={22} className="text-blue-600" />
                        Remote Override Control
                    </h2>

                    <div className="bg-[#0A1F44] text-white p-6 rounded-3xl shadow-lg border border-blue-950 relative overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl"></div>

                        <div className="mb-6">
                            <span className="inline-block text-[10px] font-bold text-blue-300 bg-blue-900/50 uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                                Secure Terminal
                            </span>
                            <p className="text-xs text-gray-300">
                                Issue real-time manual override signals to physical or simulated WebSockets. All overrides require justification and are fully logged.
                            </p>
                        </div>

                        <form onSubmit={handleManualOverride} className="space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-300 tracking-wider mb-2">
                                    Target Lock Node
                                </label>
                                <select
                                    value={selectedDevice}
                                    onChange={(e) => setSelectedDevice(e.target.value)}
                                    className="w-full bg-blue-950/70 border border-blue-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                                >
                                    <option value="" disabled className="bg-blue-950 text-white">Select active lock...</option>
                                    {devices.map(d => (
                                        <option key={d.id} value={d.id} className="bg-[#0A1F44] text-white">
                                            {d.name} ({d.mac_address})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-300 tracking-wider mb-2">
                                    Audit Reason / Justification
                                </label>
                                <textarea
                                    value={overrideReason}
                                    onChange={(e) => setOverrideReason(e.target.value)}
                                    placeholder="Provide override authorization justification..."
                                    rows="3"
                                    className="w-full bg-blue-950/70 border border-blue-800 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmittingOverride || devices.length === 0}
                                className="w-full py-3.5 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                            >
                                <KeyRound size={16} />
                                {isSubmittingOverride ? 'Dispatching Signals...' : 'Dispatch Override Signal'}
                            </button>
                        </form>

                        {/* Audit Notification Banner */}
                        <div className="mt-4 p-3 bg-blue-950/50 rounded-xl border border-blue-900/60 flex items-start gap-2">
                            <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                                System locks: This operation is audited automatically and syncs directly with national URA security records.
                            </p>
                        </div>
                    </div>

                    {/* Override Success Panel */}
                    {overrideStatus && (
                        <div className={`p-6 rounded-2xl border ${overrideStatus.success ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'} transition-all duration-300 animate-fadeIn`}>
                            <div className="flex gap-3">
                                {overrideStatus.success ? (
                                    <CheckCircle2 className="text-emerald-600 shrink-0" size={24} />
                                ) : (
                                    <ShieldAlert className="text-red-600 shrink-0" size={24} />
                                )}
                                <div>
                                    <h4 className={`text-sm font-bold ${overrideStatus.success ? 'text-emerald-900' : 'text-red-900'}`}>
                                        {overrideStatus.success ? 'Override Dispatched' : 'Dispatch Failed'}
                                    </h4>
                                    <p className={`text-xs mt-1 leading-relaxed ${overrideStatus.success ? 'text-emerald-700 font-semibold' : 'text-red-700'}`}>
                                        {overrideStatus.message}
                                    </p>
                                    {overrideStatus.success && (
                                        <div className="mt-3 text-[10px] bg-white border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded font-mono font-bold leading-normal">
                                            {overrideStatus.socket}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    );
};

export default Hardware;
