import React from 'react';

const GlassCard = ({ children, isDark }) => {
    return (
        <div className={`
      p-8 rounded-3xl border backdrop-blur-lg transition-colors duration-500
      ${isDark
                ? 'bg-white/10 border-white/20 text-white shadow-[0_0_20px_rgba(0,0,0,0.5)]'
                : 'light-glass text-gray-900'}
    `}>
            {children}
        </div>
    );
};

export default GlassCard;
