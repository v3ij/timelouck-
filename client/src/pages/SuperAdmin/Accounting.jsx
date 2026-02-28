import React from 'react';
import { DollarSign, FileText, Download, TrendingUp } from 'lucide-react';
import { showToast } from '../../components/GlobalToast';

import PageHeader from '../../components/PageHeader';

const Accounting = () => {
    const handleDownload = () => {
        showToast('Generating Tax Report PDF...');
        setTimeout(() => window.print(), 800);
    };

    return (
        <div className="font-sans space-y-8">
            <PageHeader title="Accounting & Billing" description="System owner profit statements and tax reports.">
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-[#0A1F44] hover:bg-blue-900 text-white px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                >
                    <Download size={18} />
                    <span className="font-bold text-sm">Download Tax Report (PDF)</span>
                </button>
            </PageHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Gross */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-[#0A1F44]/30 transition-colors">
                    <div className="absolute -right-6 -top-6 text-gray-50 opacity-10 group-hover:scale-110 transition-transform"><DollarSign size={120} /></div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs">Total Gross Volume</h3>
                    </div>
                    <p className="text-4xl font-extrabold text-[#0A1F44] mt-2">UGX 450,000</p>
                    <p className="text-sm text-green-600 font-medium mt-2">+12% from last month</p>
                </div>

                {/* Cortex Cut */}
                <div className="bg-gradient-to-br from-[#0A1F44] to-blue-900 p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-white/20 text-white p-2 rounded-lg backdrop-blur-md">
                            <DollarSign size={20} />
                        </div>
                        <h3 className="text-gray-300 font-bold uppercase tracking-wider text-xs">Cortex Net Profit (5% Cut)</h3>
                    </div>
                    <p className="text-4xl font-extrabold text-white mt-2">UGX 22,500</p>
                    <p className="text-sm text-blue-200 font-medium mt-2">To be settled next Friday</p>
                </div>
            </div>

            {/* Simulated P&L Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-[#0A1F44] flex items-center gap-2">
                        <FileText size={18} className="text-blue-600" /> Latest Settlements
                    </h3>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="text-gray-500 bg-gray-50">
                        <tr>
                            <th className="p-4 font-bold">Tenant Name</th>
                            <th className="p-4 font-bold text-right">Gross (UGX)</th>
                            <th className="p-4 font-bold text-right">Owner Cut (5%)</th>
                            <th className="p-4 font-bold text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50/80 transition-colors">
                            <td className="p-4 font-bold text-[#0A1F44]">Test School</td>
                            <td className="p-4 text-right font-medium">300,000</td>
                            <td className="p-4 text-right font-bold text-green-600">15,000</td>
                            <td className="p-4 text-center"><span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-bold ring-1 ring-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">Paid</span></td>
                        </tr>
                        <tr className="hover:bg-gray-50/80 transition-colors">
                            <td className="p-4 font-bold text-[#0A1F44]">Test Hotel</td>
                            <td className="p-4 text-right font-medium">150,000</td>
                            <td className="p-4 text-right font-bold text-green-600">7,500</td>
                            <td className="p-4 text-center"><span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-xs font-bold ring-1 ring-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]">Pending</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Accounting;
