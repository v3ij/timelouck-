import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, CheckCircle, CreditCard, Download, Bell } from 'lucide-react';

const Financials = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState({ show: false, message: '' });

    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    const plans = [
        {
            name: 'Basic',
            price: 'UGX 100,000',
            period: '/month',
            description: 'Essential access control for small offices.',
            features: ['Up to 5 Smart Locks', '10 User Accounts', 'Basic Access Logs', 'Email Support'],
            highlighted: false
        },
        {
            name: 'Pro',
            price: 'UGX 300,000',
            period: '/month',
            description: 'Advanced features for growing businesses.',
            features: ['Up to 20 Smart Locks', 'Unlimited Users', 'Real-time Audit Logs', 'Remote Unlock', 'Priority Support'],
            highlighted: true
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: '',
            description: 'Scalable solutions for large facilities.',
            features: ['Unlimited Smart Locks', 'SSO Integration', 'Custom Data Retention', 'Dedicated Account Manager'],
            highlighted: false
        }
    ];

    const transactions = [
        { id: 'INV-001', date: '2023-10-25', user: 'David Okello', amount: 'UGX 300,000', status: 'Paid' },
        { id: 'INV-002', date: '2023-10-24', user: 'Grace Nakato', amount: 'UGX 100,000', status: 'Paid' },
        { id: 'INV-003', date: '2023-10-22', user: 'John Mugisha', amount: 'UGX 50,000', status: 'Pending' },
    ];

    return (
        <div className="min-h-screen bg-[#F4F6F9] font-sans text-slate-800 relative">
            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed bottom-10 right-10 z-50 animate-fade-in-up">
                    <div className="bg-[#0A1F44] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
                        <div className="bg-[#1EC677] rounded-full p-1">
                            <CheckCircle size={16} className="text-[#0A1F44]" />
                        </div>
                        <span className="font-medium">{toast.message}</span>
                    </div>
                </div>
            )}

            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-bold text-[#0A1F44] flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#FFA500]" />
                            Financial Overview
                        </h1>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Plans Grid */}
                <h2 className="text-lg font-bold text-[#0A1F44] mb-6">Subscription Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {plans.map((plan, index) => (
                        <div key={index} className={`bg-white rounded-2xl p-6 border ${plan.highlighted ? 'border-[#FFA500] shadow-lg shadow-orange-500/10 relative' : 'border-slate-200'}`}>
                            {plan.highlighted && <span className="absolute top-0 right-0 bg-[#FFA500] text-[#0A1F44] text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">POPULAR</span>}
                            <h3 className="text-xl font-bold text-[#0A1F44]">{plan.name}</h3>
                            <div className="flex items-baseline my-4">
                                <span className="text-2xl font-bold text-[#0A1F44]">{plan.price}</span>
                                <span className="text-slate-400 text-sm ml-1">{plan.period}</span>
                            </div>
                            <p className="text-sm text-slate-500 mb-6">{plan.description}</p>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                        <CheckCircle className="w-4 h-4 text-[#1EC677]" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => showToast('Plan upgrade request sent to Admin.')}
                                className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${plan.highlighted ? 'bg-[#FFA500] text-[#0A1F44] hover:bg-orange-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                Manage Plan
                            </button>
                        </div>
                    ))}
                </div>

                {/* Recent Transactions */}
                <h2 className="text-lg font-bold text-[#0A1F44] mb-6">Recent Transactions (UGX)</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="px-6 py-4">Invoice ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-[#0A1F44]">{tx.id}</td>
                                    <td className="px-6 py-4 text-slate-500">{tx.date}</td>
                                    <td className="px-6 py-4 text-slate-600">{tx.user}</td>
                                    <td className="px-6 py-4 font-medium text-[#0A1F44]">{tx.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${tx.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
    );
};

export default Financials;
