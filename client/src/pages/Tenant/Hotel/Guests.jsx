import React from 'react';
import { mock } from '../../../data/mock';

const HotelGuests = () => {
    const { rooms } = mock;
    const occupied = rooms.filter(r => r.status === 'Occupied');

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Guest Directory</h1>
                <p className="text-slate-500 text-sm mt-1">Currently registered guests and profiles.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest Information</th>
                            <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Room Assignment</th>
                            <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Check-in Status</th>
                            <th className="p-6"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {occupied.map((room, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-6">
                                    <div className="font-bold text-slate-800">{room.guest}</div>
                                    <div className="text-xs text-slate-400 mt-0.5">ID: GST-{202400 + idx}</div>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 rounded-lg font-bold text-slate-600 font-mono text-sm">
                                            {room.id}
                                        </div>
                                        <span className="text-sm text-slate-500">{room.type}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold">
                                        Checked In
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <button className="text-[#0A1F44] font-bold text-sm hover:underline hover:text-[#FFA500] transition-colors">
                                        View Profile
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HotelGuests;
