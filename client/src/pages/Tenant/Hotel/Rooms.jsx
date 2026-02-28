import React from 'react';
import { Wifi, Battery, AlertTriangle } from 'lucide-react';
import { mock } from '../../../data/mock';

const HotelRooms = () => {
    const { rooms } = mock;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Room Status</h1>
                <p className="text-slate-500 text-sm mt-1">Live monitoring of smart door locks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {rooms.map((room) => (
                    <div key={room.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                        {/* Status Strip */}
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${room.status === 'Occupied' ? 'bg-[#FFA500]' :
                                room.status === 'Available' ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}></div>

                        <div className="flex justify-between items-start mb-6 pl-3">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Room {room.id}</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{room.type}</p>
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                <Battery size={14} className={room.battery < 20 ? 'text-red-500' : 'text-slate-600'} />
                                <span className="text-xs font-bold text-slate-700">{room.battery}%</span>
                            </div>
                        </div>

                        <div className="space-y-3 pl-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">Status</span>
                                <span className={`font-bold ${room.status === 'Occupied' ? 'text-orange-600' :
                                        room.status === 'Available' ? 'text-emerald-600' : 'text-slate-400'
                                    }`}>
                                    {room.status}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-sm border-t border-slate-50 pt-3">
                                <span className="text-slate-500 font-medium">Guest</span>
                                <span className="font-bold text-slate-800">{room.guest || '—'}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm pt-1">
                                <span className="text-slate-500 font-medium">Lock</span>
                                <div className="flex items-center gap-1 text-emerald-600">
                                    <Wifi size={14} />
                                    <span className="font-bold text-xs">Online</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HotelRooms;
