import React, { useState, useEffect } from 'react';

export const showToast = (message) => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: message }));
};

export const GlobalToast = () => {
    const [toast, setToast] = useState({ visible: false, message: '' });

    useEffect(() => {
        const handleShowToast = (e) => {
            setToast({ visible: true, message: e.detail });
            setTimeout(() => {
                setToast({ visible: false, message: '' });
            }, 3000);
        };

        window.addEventListener('show-toast', handleShowToast);
        return () => window.removeEventListener('show-toast', handleShowToast);
    }, []);

    if (!toast.visible) return null;

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <div className="bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl border border-slate-700 flex items-center gap-3">
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <p className="font-semibold text-sm">{toast.message}</p>
            </div>
        </div>
    );
};
