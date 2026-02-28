import React from 'react';
import { Battery, Wifi, WifiOff } from 'lucide-react';
import { mock } from '../../data/mock';

const HotelRooms = () => {
    const { rooms } = mock;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Room Status Manager</h1>
                <div className="flex gap-2 text-sm font-medium">
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Available</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Occupied</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-500 rounded-full"></div> Cleaning</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {rooms.map((room) => (
                    <div key={room.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all">
                        <div className={`absolute top-0 left-0 w-2 h-full ${room.status === 'Occupied' ? 'bg-red-500' :
                            room.status === 'Cleaning' ? 'bg-orange-500' : 'bg-emerald-500'
                            }`}></div>

                        <div className="flex justify-between items-start mb-4 pl-4">
                            <h2 className="text-2xl font-bold text-slate-800">{room.id}</h2>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-slate-400 bg-slate-50 px-2 py-1 rounded-full text-xs">
                                    <Battery size={12} className={room.battery < 20 ? 'text-red-500' : 'text-emerald-500'} />
                                    {room.battery}%
                                </div>
                                {room.lockStatus === 'Online' ? <Wifi size={14} className="text-emerald-500" /> : <WifiOff size={14} className="text-red-500" />}
                            </div>
                        </div>

                        <div className="pl-4 space-y-2">
                            <div className="text-sm">
                                <span className="text-slate-400">Type: </span>
                                <span className="font-medium text-slate-700">{room.type}</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-slate-400">Guest: </span>
                                <span className="font-medium text-slate-700">{room.guest}</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-slate-400">Check-out: </span>
                                <span className="font-medium text-slate-700">{room.checkOut}</span>
                            </div>
                        </div>

                        <div className="mt-6 pl-4 flex gap-2">
                            <button className="flex-1 py-2 rounded-lg bg-slate-50 text-slate-600 text-sm font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                View Log
                            </button>
                            <button className="flex-1 py-2 rounded-lg bg-slate-50 text-slate-600 text-sm font-bold hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                Unlock
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HotelRooms;
