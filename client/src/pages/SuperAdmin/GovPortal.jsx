import React from 'react';
import { showToast } from '../../components/GlobalToast';

// Reusable SVGs for the Government Audit Portal
const BankTaxIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
);

const CloudSyncIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v-2a4 4 0 014-4h8a4 4 0 014 4v2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v6m-3-3l3 3 3-3" />
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const DownloadPdfIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const BoxArchiveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#0A1F44]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
);


const BadgeSynced = () => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold font-sans tracking-wide bg-[#059669]/10 text-[#059669] border border-[#059669]/20">
        <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mr-1.5"></span> Synced
    </span>
);

const BadgePending = () => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold font-sans tracking-wide bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mr-1.5 animate-pulse"></span> Pending
    </span>
);

const GovPortal = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans p-8 flex flex-col items-center">
            <div className="w-full max-w-7xl">

                {/* Header Section */}
                <div className="mb-8 border-b-2 border-gray-200 pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#0A1F44] tracking-tight">Government Compliance & ERP Integration</h1>
                        <p className="text-gray-500 mt-2 text-base font-semibold uppercase tracking-wider">Automated Tax Sync & Audit Logs</p>
                    </div>
                    <div className="flex items-center space-x-3 bg-white px-4 py-2 border border-gray-200 shadow-sm">
                        <div className="h-2 w-2 bg-[#059669]"></div>
                        <span className="text-xs font-mono font-bold text-gray-700 tracking-wider">SYSTEM STATUS: FULLY COMPLIANT <span className="ml-2 font-normal text-gray-400">| AS OF 10:48 AM</span></span>
                    </div>
                </div>

                {/* Top Grid - 4 Audit Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                    {/* Card 1: Total V.A.T Collected */}
                    <div className="bg-white p-6 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-colors">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-2 bg-gray-50 text-gray-800 border border-gray-100 rounded">
                                <BankTaxIcon />
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1 font-sans">Total V.A.T Collected</p>
                            <h2 className="text-3xl font-bold text-[#0A1F44] font-mono tracking-tight">UGX 8,450,000</h2>
                        </div>
                    </div>

                    {/* Card 2: API Sync Status */}
                    <div className="bg-white p-6 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-colors relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#059669]"></div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-2 bg-[#059669]/5 text-[#059669] border border-[#059669]/10 rounded">
                                <CloudSyncIcon />
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1 font-sans">API Sync Status</p>
                            <h2 className="text-base font-bold text-[#059669] tracking-tight mt-1 flex items-center">
                                URA / KRA: Connected & Syncing
                            </h2>
                        </div>
                    </div>

                    {/* Card 3: Data Retention */}
                    <div className="bg-white p-6 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-gray-50 text-gray-600 border border-gray-100 rounded">
                                <ShieldIcon />
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1 font-sans">Data Retention</p>
                            <h2 className="text-xl font-bold text-[#0A1F44] tracking-tight">Compliant</h2>
                            <p className="text-sm text-gray-400 font-bold mt-1">5 Years Encrypted Storage</p>
                        </div>
                    </div>

                    {/* Card 4: Pending Audits */}
                    <div className="bg-white p-6 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-gray-50 text-gray-600 border border-gray-100 rounded">
                                <DocumentIcon />
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1 font-sans">Pending Audits</p>
                            <h2 className="text-3xl font-bold text-[#0A1F44] font-mono tracking-tight">0 <span className="text-base font-sans font-medium text-gray-400">Pending</span></h2>
                        </div>
                    </div>
                </div>

                {/* Main Content Split (Action Bar & Live Feed) */}
                <div className="bg-white border border-gray-200 shadow-sm">

                    {/* Action Bar */}
                    <div className="border-b border-gray-200 p-4 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <h3 className="text-lg font-extrabold text-[#0A1F44] font-sans">Live Tax & Accounting Feed</h3>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    showToast('Master PDF Downloaded');
                                    setTimeout(() => window.print(), 500);
                                }}
                                className="flex items-center bg-white border border-gray-300 text-gray-700 font-bold text-xs py-2 px-4 shadow-sm hover:bg-gray-50 transition-colors"
                            >
                                <DownloadPdfIcon />
                                Export Monthly URA Report (PDF)
                            </button>
                            <button
                                onClick={() => showToast('Module Ready for Future Integration: Running Manual Tax Sync')}
                                className="flex items-center bg-[#0A1F44] text-white font-bold text-xs py-2 px-4 shadow-sm hover:bg-[#153063] transition-colors border border-[#0A1F44]"
                            >
                                <RefreshIcon />
                                Run Manual Tax Sync
                            </button>
                            <button
                                onClick={() => showToast('Module Ready for Future Integration: Audit Trail Download')}
                                className="flex items-center bg-[#FFA500]/10 border border-[#FFA500]/30 text-[#0A1F44] font-bold text-xs py-2 px-4 shadow-sm hover:bg-[#FFA500]/20 transition-colors"
                            >
                                <BoxArchiveIcon />
                                Download Audit Trail
                            </button>
                        </div>
                    </div>

                    {/* Live Tax & Accounting Feed (Detailed Data Table) */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b-2 border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    <th className="py-4 px-6 font-sans">Transaction ID</th>
                                    <th className="py-4 px-6 font-sans">Date</th>
                                    <th className="py-4 px-6 font-sans">Source (Tenant)</th>
                                    <th className="py-4 px-6 font-sans text-right">Gross Amount</th>
                                    <th className="py-4 px-6 font-sans text-right">Tax (18%)</th>
                                    <th className="py-4 px-6 font-sans text-center">Sync Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-mono text-sm text-gray-800">

                                {/* Row 1 */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 font-bold text-[#0A1F44]">TXN-8992</td>
                                    <td className="py-4 px-6 text-gray-500 text-xs">Today, 09:00 AM</td>
                                    <td className="py-4 px-6 font-sans font-medium">Grand Kampala Suites <span className="block text-xs text-gray-400 mt-0.5">Micro-Rent</span></td>
                                    <td className="py-4 px-6 text-right">UGX 50,000</td>
                                    <td className="py-4 px-6 text-right font-bold text-[#0A1F44]">UGX 9,000</td>
                                    <td className="py-4 px-6 text-center"><BadgeSynced /></td>
                                </tr>

                                {/* Row 2 */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 font-bold text-[#0A1F44]">TXN-8993</td>
                                    <td className="py-4 px-6 text-gray-500 text-xs">Today, 09:15 AM</td>
                                    <td className="py-4 px-6 font-sans font-medium">Kampala High School <span className="block text-xs text-gray-400 mt-0.5">UGX 5,000 (SMS Fee)</span></td>
                                    <td className="py-4 px-6 text-right">UGX 5,000</td>
                                    <td className="py-4 px-6 text-right font-bold text-[#0A1F44]">UGX 900</td>
                                    <td className="py-4 px-6 text-center"><BadgeSynced /></td>
                                </tr>

                                {/* Row 3 - Pending */}
                                <tr className="bg-[#F59E0B]/5 hover:bg-[#F59E0B]/10 transition-colors">
                                    <td className="py-4 px-6 font-bold text-[#0A1F44]">TXN-8994</td>
                                    <td className="py-4 px-6 text-gray-500 text-xs">Today, 09:30 AM</td>
                                    <td className="py-4 px-6 font-sans font-medium">Hotel Africana <span className="block text-xs text-gray-400 mt-0.5">Standard Rent</span></td>
                                    <td className="py-4 px-6 text-right">UGX 150,000</td>
                                    <td className="py-4 px-6 text-right font-bold text-[#0A1F44]">UGX 27,000</td>
                                    <td className="py-4 px-6 text-center"><BadgePending /></td>
                                </tr>

                                {/* Row 4 */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 font-bold text-[#0A1F44]">TXN-8995</td>
                                    <td className="py-4 px-6 text-gray-500 text-xs">Yesterday, 14:00 PM</td>
                                    <td className="py-4 px-6 font-sans font-medium">Grand Kampala Suites <span className="block text-xs text-gray-400 mt-0.5">Micro-Rent</span></td>
                                    <td className="py-4 px-6 text-right">UGX 45,000</td>
                                    <td className="py-4 px-6 text-right font-bold text-[#0A1F44]">UGX 8,100</td>
                                    <td className="py-4 px-6 text-center"><BadgeSynced /></td>
                                </tr>

                                {/* Row 5 */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 font-bold text-[#0A1F44]">TXN-8996</td>
                                    <td className="py-4 px-6 text-gray-500 text-xs">Yesterday, 16:45 PM</td>
                                    <td className="py-4 px-6 font-sans font-medium">Makerere Univ. Lab <span className="block text-xs text-gray-400 mt-0.5">Admin Fee</span></td>
                                    <td className="py-4 px-6 text-right">UGX 20,000</td>
                                    <td className="py-4 px-6 text-right font-bold text-[#0A1F44]">UGX 3,600</td>
                                    <td className="py-4 px-6 text-center"><BadgeSynced /></td>
                                </tr>

                            </tbody>
                        </table>

                        {/* Pagination / Footer */}
                        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest font-sans">Showing 5 of 1,248 Records</span>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-white border border-gray-300 text-gray-400 font-bold text-xs rounded hover:bg-gray-50">Prev</button>
                                <button className="px-3 py-1 bg-[#0A1F44] text-white font-bold text-xs rounded">1</button>
                                <button className="px-3 py-1 bg-white border border-gray-300 text-gray-600 font-bold text-xs rounded hover:bg-gray-50">2</button>
                                <button className="px-3 py-1 bg-white border border-gray-300 text-gray-600 font-bold text-xs rounded hover:bg-gray-50">3</button>
                                <button className="px-3 py-1 bg-white border border-gray-300 text-gray-600 font-bold text-xs rounded hover:bg-gray-50">Next</button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default GovPortal;
