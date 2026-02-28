import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PageHeader = ({ title, description, backTo = "/superadmin/dashboard", children }) => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-start sm:flex-row flex-col gap-4 mb-8">
            <div className="flex items-start gap-4">
                <button
                    onClick={() => navigate(backTo === -1 ? -1 : backTo)}
                    className="mt-1 p-2 bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#0A1F44] hover:shadow-md hover:-translate-x-0.5 rounded-xl transition-all duration-200 active:scale-95 group"
                    title="Go Back"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-[#0A1F44] tracking-tight">{title}</h1>
                    {description && <p className="text-gray-500 mt-1 font-medium">{description}</p>}
                </div>
            </div>
            {children && <div>{children}</div>}
        </div>
    );
};

export default PageHeader;
