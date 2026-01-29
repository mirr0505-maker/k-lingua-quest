import React from 'react';

export const ThemeToggle = ({ isDark, setIsDark }) => {
    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full border border-gray-500/30 transition-all hover:scale-110 flex items-center gap-2 font-bold text-sm bg-white/10 backdrop-blur-md"
        >
            {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
    );
};
