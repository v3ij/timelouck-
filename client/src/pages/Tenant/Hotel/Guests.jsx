import React, { useState, useEffect } from 'react';
import { fetchTenantUsers } from '../../../services/api';
import { Loader } from 'lucide-react';
import { showToast } from '../../../components/GlobalToast';

const HotelGuests = () => {
    const [guests, setGuests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const HOTEL_TENANT_ID = 2; // Kampala Sheraton Hotel ID

    useEffect(() => {
        const loadGuests = async () => {
            setIsLoading(true);
            const res = await fetchTenantUsers(HOTEL_TENANT_ID);
            if (res && res.status === 'success') {
                setGuests(res.data);
            } else {
                showToast('Failed to load guest registry.');
            }
            setIsLoading(false);
        };
        loadGuests();
    }, []);

    return (
        <div className="font-sans">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Guest Directory</h1>
                <p className="text-slate-500 text-sm mt-1">Currently active guest registrations, room occupancy, and RFID leases.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <Loader className="animate-spin text-blue-600 mb-3" size={28} />
                        <p className="text-slate-500 font-bold text-sm">Accessing hotel guest ledger...</p>
                    </div>
                ) : guests.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-slate-500 font-bold">No active guests checked into the hotel.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest Information</th>
                                <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Room Assignment</th>
                                <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Check-in Status</th>
                                <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Card Balance</th>
                                <th className="p-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {guests.map((guest, idx) => (
                                <tr key={guest.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6">
                                        <div className="font-bold text-slate-800 text-sm">{guest.name}</div>
                                        <div className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Guest ID: GST-{202400 + guest.id}</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-100 rounded-lg font-bold text-slate-600 font-mono text-xs">
                                                Suite {100 + (idx * 5)}
                                            </div>
                                            <span className="text-xs text-slate-500">Deluxe King</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                            Checked In
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <span className="font-bold text-slate-800 text-sm">
                                            UGX {guest.wallet.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button className="text-[#0A1F44] font-bold text-xs hover:underline hover:text-[#FFA500] transition-colors">
                                            Manage Key
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default HotelGuests;
