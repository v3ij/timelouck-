import React from 'react';

const Logo = ({ className = "", variant = "default" }) => {
    const isLogin = variant === "large";
    const textSize = isLogin ? "text-4xl" : "text-xl";
    const iconSize = isLogin ? 48 : 24;
    const subText = isLogin ? (
        <p className="text-blue-200/50 text-sm mt-3 tracking-widest uppercase font-medium text-center">
            Secure Enterprise Solutions
        </p>
    ) : (
        <p className="text-xs text-blue-300">Admin Console</p>
    );

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <div className={`flex items-center gap-3 ${isLogin ? 'mb-4 flex-col' : ''}`}>

                {/* SVG Icon: Shield + Lock Combination */}
                <div className={`relative flex items-center justify-center ${isLogin ? 'p-4 bg-white/5 rounded-3xl ring-1 ring-white/10 shadow-2xl' : ''}`}>
                    <svg
                        width={iconSize}
                        height={iconSize}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={isLogin ? "" : ""}
                    >
                        {/* Shield Base */}
                        <path
                            d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
                            fill={isLogin ? "#0A1F44" : "#FFA500"}
                            stroke={isLogin ? "#FFA500" : "#0A1F44"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {/* Lock Body */}
                        <path
                            d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11"
                            stroke={isLogin ? "#FFA500" : "#0A1F44"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {/* Keyhole */}
                        <circle cx="12" cy="14" r="1" fill={isLogin ? "#FFA500" : "#0A1F44"} />
                    </svg>
                </div>

                {/* Text Branding */}
                <div className={isLogin ? "text-center" : ""}>
                    <h1 className={`${textSize} font-bold text-white tracking-tight`}>
                        TimeLock <span className="text-[#FFA500]">Access</span>
                    </h1>
                    {!isLogin && subText}
                </div>
            </div>
            {isLogin && subText}
        </div>
    );
};

export default Logo;
