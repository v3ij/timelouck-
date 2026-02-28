import React from 'react';
import { Home, Wifi, WifiOff, DollarSign } from 'lucide-react';
import { mockData } from '../../data/mockData';

const HotelDashboard = () => {
    const { rooms } = mockData;

    // Calculate Stats
    const totalRooms = rooms.length;
    const occupied = rooms.filter(r => r.status === 'Occupied').length;
    const activeLocks = rooms.filter(r => r.lockStatus === 'Online').length;
    const inactiveLocks = totalRooms - activeLocks;

    const stats = [
        { label: 'Total Rooms', value: totalRooms, sub: `${occupied} Occupied`, icon: Home, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Active Locks', value: activeLocks, sub: 'Online & Secure', icon: Wifi, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Inactive Locks', value: inactiveLocks, sub: 'Maintenance Required', icon: WifiOff, color: 'text-red-500', bg: 'bg-red-50' },
        { label: "RevPAR", value: 'UGX 1.2M', sub: 'Today Estimate', icon: DollarSign, color: 'text-orange-500', bg: 'bg-orange-50' },
    ];

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Hotel Operations</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
                        <p className="text-slate-500 text-sm mt-1">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* Quick Room Status Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4">Live Room Grid</h3>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {rooms.map((room) => (
                        <div key={room.id} className={`aspect-square rounded-lg flex flex-col items-center justify-center border text-xs font-bold cursor-pointer hover:scale-105 transition-transform ${room.status === 'Occupied' ? 'bg-red-50 border-red-200 text-red-600' :
                                room.status === 'Cleaning' ? 'bg-orange-50 border-orange-200 text-orange-600' :
                                    'bg-emerald-50 border-emerald-200 text-emerald-600'
                            }`}>
                            <span>{room.id}</span>
                            {room.lockStatus === 'Offline' && <WifiOff size={10} className="text-slate-400 mt-1" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HotelDashboard;
