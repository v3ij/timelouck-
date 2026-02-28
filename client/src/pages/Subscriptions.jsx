import React from 'react';
import { Check } from 'lucide-react';

const Subscriptions = () => {
    const plans = [
        {
            name: 'Basic',
            price: '$29',
            period: '/month',
            description: 'Essential access control for small offices.',
            features: [
                'Up to 5 Smart Locks',
                '10 User Accounts',
                'Basic Access Logs',
                'Mobile App Access',
                'Email Support'
            ],
            cta: 'Start Basic',
            highlighted: false
        },
        {
            name: 'Pro',
            price: '$79',
            period: '/month',
            description: 'Advanced features for growing businesses.',
            features: [
                'Up to 20 Smart Locks',
                'Unlimited Users',
                'Real-time Audit Logs',
                'Remote Unlock',
                'Priority 24/7 Support',
                'API Access'
            ],
            cta: 'Upgrade to Pro',
            highlighted: true
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: '',
            description: 'Scalable solutions for large facilities.',
            features: [
                'Unlimited Smart Locks',
                'SSO Integration',
                'Custom Data Retention',
                'Dedicated Account Manager',
                'On-premise Deployment Option',
                'SLA Guarantee'
            ],
            cta: 'Contact Sales',
            highlighted: false
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Choose the perfect plan for your security needs. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-2xl p-8 backdrop-blur-xl transition-all duration-300 hover:transform hover:-translate-y-2 
                ${plan.highlighted
                                    ? 'bg-slate-800/80 border-2 border-teal-500 shadow-2xl shadow-teal-500/20'
                                    : 'bg-slate-800/40 border border-gray-700 hover:border-gray-500'
                                }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-teal-500 text-black text-sm font-bold px-4 py-1 rounded-full">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <p className="text-gray-400 mb-6 h-12">{plan.description}</p>

                            <div className="flex items-baseline mb-8">
                                <span className="text-4xl font-bold text-white">{plan.price}</span>
                                <span className="text-gray-400 ml-2">{plan.period}</span>
                            </div>

                            <button className={`w-full py-3 px-6 rounded-lg font-bold mb-8 transition-colors
                ${plan.highlighted
                                    ? 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white'
                                    : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}>
                                {plan.cta}
                            </button>

                            <div className="space-y-4">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center text-gray-300">
                                        <Check className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center text-gray-400">
                    <p>Need a custom integration? <a href="#" className="text-teal-400 hover:underline">Talk to our engineering team</a></p>
                </div>
            </div>
        </div>
    );
};

export default Subscriptions;
