import React from 'react';
import { ArrowLeft, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserQR = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 text-center">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors absolute top-6 left-6">
                <ArrowLeft size={18} />
                Back
            </button>

            <div className="pt-12">
                <div className="bg-white p-6 rounded-3xl inline-block shadow-2xl shadow-blue-900/20">
                    <QrCode size={200} className="text-slate-900" />
                </div>
                <h2 className="text-2xl font-bold mt-6">Scan to Access</h2>
                <p className="text-slate-400 text-sm mt-2">Align this code with the scanner at the gate.</p>

                <div className="mt-8 flex justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200"></div>
                </div>
                <p className="text-xs text-blue-400 mt-2 font-mono">CODE REFRESHING IN 28s</p>
            </div>
        </div>
    );
};

export default UserQR;
