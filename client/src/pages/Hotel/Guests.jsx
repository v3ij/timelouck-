import React from 'react';
import { mockData } from '../../data/mockData';

const HotelGuests = () => {
    const { rooms } = mockData;
    const activeGuests = rooms.filter(r => r.status === 'Occupied');

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Current Guests</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-6">Guest Name</th>
                            <th className="p-6">Room</th>
                            <th className="p-6">Check-Out Date</th>
                            <th className="p-6 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {activeGuests.map((room, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                                <td className="p-6 font-bold text-slate-800">{room.guest}</td>
                                <td className="p-6 font-mono text-slate-600 font-medium">{room.id}</td>
                                <td className="p-6 text-slate-600">{room.checkOut}</td>
                                <td className="p-6 text-right">
                                    <button className="text-blue-600 font-bold text-sm hover:underline">Extend Stay</button>
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
