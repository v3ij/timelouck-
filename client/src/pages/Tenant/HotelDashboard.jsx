import React from 'react';
import { Home, Wifi, WifiOff, DollarSign, Key, User, CheckCircle, XCircle } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { showToast } from '../../components/GlobalToast';

const HotelDashboard = () => {
    // HARDCODED HOTEL HARDWARE DATA
    const stats = [
        { label: 'Total Rooms', value: '50', sub: 'Capacity', icon: Home, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Active Locks', value: '48', sub: 'Online & Secure', icon: Wifi, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Inactive Locks', value: '2', sub: 'Offline / Low Batt', icon: WifiOff, color: 'text-red-500', bg: 'bg-red-50' },
        { label: "Today's Income", value: 'UGX 1.2M', sub: 'Daily Rent', icon: DollarSign, color: 'text-orange-500', bg: 'bg-orange-50' },
    ];

    const rooms = [
        { id: '101', guest: 'John Doe', status: 'Occupied', payment: 'Paid', lock: 'Online' },
        { id: '102', guest: 'Jane Smith', status: 'Occupied', payment: 'Pending', lock: 'Online' },
        { id: '103', guest: '-', status: 'Vacant', payment: '-', lock: 'Online' },
        { id: '104', guest: 'Mike Johnson', status: 'Occupied', payment: 'Paid', lock: 'Offline' }, // Offline Alert
        { id: '105', guest: '-', status: 'Vacant', payment: '-', lock: 'Online' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex text-slate-800">
            {/* Sidebar inclusion handled by potential wrapper or just manually here for now if needed, 
                but ideally App.jsx/Layout handles it. Given current state, pages invoke Sidebar or are wrapped. 
                We will assume standard Sidebar is present via App layout or we include it if previous pattern dictates.
                Looking at SchoolDashboard, it included Sidebar. */}
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Hotel Dashboard</h1>
                        <p className="text-slate-500">Hardware Status & Occupancy • Serena Hotel</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                showToast('Compiling Hotel Report...');
                                setTimeout(() => window.print(), 500);
                            }}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
                        >
                            Download Report
                        </button>
                        <button
                            onClick={() => showToast('Module Ready for Future Integration: New Booking Engine')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200"
                        >
                            + New Booking
                        </button>
                    </div>
                </div>

                {/* Hardware Status Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={stat.color} size={24} />
                                </div>
                                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Live</span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                                <p className="text-xs text-slate-400 mt-2">{stat.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Live Room Status Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Live Room Status</h3>
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            System Online
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                                <tr>
                                    <th className="p-4">Room</th>
                                    <th className="p-4">Guest</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Payment</th>
                                    <th className="p-4">Lock Connectivity</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rooms.map((room) => (
                                    <tr key={room.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-4 font-bold text-slate-700">#{room.id}</td>
                                        <td className="p-4 flex items-center gap-2 text-slate-600">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <User size={14} />
                                            </div>
                                            {room.guest}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${room.status === 'Occupied' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {room.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${room.payment === 'Paid' ? 'bg-emerald-100 text-emerald-600' :
                                                room.payment === 'Pending' ? 'bg-orange-100 text-orange-600' : 'text-slate-400'
                                                }`}>
                                                {room.payment}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {room.lock === 'Online' ? (
                                                    <Wifi size={16} className="text-emerald-500" />
                                                ) : (
                                                    <WifiOff size={16} className="text-red-500" />
                                                )}
                                                <span className={`text-sm font-medium ${room.lock === 'Online' ? 'text-emerald-600' : 'text-red-600'
                                                    }`}>
                                                    {room.lock}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => showToast(`Module Ready for API Binding: Manage Room #${room.id}`)}
                                                className="text-blue-500 hover:text-blue-700 font-medium text-sm"
                                            >
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HotelDashboard;
