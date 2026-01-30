import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
    const { isDark, setIsDark } = useTheme();

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full border border-gray-500/30 transition-all hover:scale-110"
        >
            {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
    );
};
