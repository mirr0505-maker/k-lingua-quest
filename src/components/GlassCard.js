import React from 'react';

const GlassCard = ({ children, isDark, className = '' }) => {
    return (
        <div className={`
      p-8 rounded-3xl border backdrop-blur-lg transition-colors duration-500
      ${isDark
                ? 'bg-white/10 border-white/20 text-white shadow-[0_0_20px_rgba(0,0,0,0.5)]'
                : 'bg-white/60 border-black/5 text-gray-900 shadow-xl'}
      ${className}
    `}>
            {children}
        </div>
    );
};

export default GlassCard;
