import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../constants/languages';

export default function Navbar({ onMenuClick, language, setLanguage, user, onAuthClick }) {
    const { isDark, setIsDark } = useTheme();
    const [isPlayMenuOpen, setIsPlayMenuOpen] = useState(false);
    const [isLangToggleOpen, setIsLangToggleOpen] = useState(false); // 언어 선택 팝다운 (우측)

    // Fallback based on props or 'ko'
    const lang = language || 'ko';
    const t = translations[lang] || translations.ko;

    const languages = [
        { code: 'en', label: 'EN' },
        { code: 'jp', label: 'JP' },
        { code: 'es', label: 'ES' },
        { code: 'ko', label: 'KR' }
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 px-10 py-4 flex justify-between items-center text-white">
            {/* 1. 로고 섹션 */}
            <div
                onClick={() => onMenuClick('home')}
                className="text-2xl font-black cursor-pointer select-none hover:opacity-80 transition"
            >
                {t.brand || t.logo}
            </div>

            {/* 2. 중앙 메뉴 섹션 */}
            <div className="flex gap-12 items-center font-bold text-gray-400">
                {/* 놀이마당 팝다운 */}
                <div
                    className="relative group cursor-pointer h-full"
                    onMouseEnter={() => setIsPlayMenuOpen(true)}
                    onMouseLeave={() => setIsPlayMenuOpen(false)}
                >
                    <span className="flex items-center gap-1 hover:text-white transition py-2">
                        {t.nav.play} <small className="text-[10px] opacity-50">▼</small>
                    </span>

                    <AnimatePresence>
                        {isPlayMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48 z-50"
                            >
                                <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl p-2 flex flex-col gap-1">
                                    <div
                                        onClick={() => { onMenuClick('wordrain'); setIsPlayMenuOpen(false); }}
                                        className="p-2 hover:bg-white/5 rounded-lg text-sm text-gray-300 hover:text-white transition cursor-pointer flex items-center gap-2"
                                    >
                                        <span className="text-base">🌧️</span> {t.play_sub1}
                                    </div>
                                    <div
                                        onClick={() => { onMenuClick('match'); setIsPlayMenuOpen(false); }}
                                        className="p-2 hover:bg-white/5 rounded-lg text-sm text-gray-300 hover:text-white transition cursor-pointer flex items-center gap-2"
                                    >
                                        <span className="text-base">🎴</span> {t.play_sub2}
                                    </div>
                                    {/* 추가 메뉴가 있다면 여기에 */}
                                    <div
                                        onClick={() => { onMenuClick('quiz'); setIsPlayMenuOpen(false); }}
                                        className="p-2 hover:bg-white/5 rounded-lg text-sm text-gray-300 hover:text-white transition cursor-pointer flex items-center gap-2"
                                    >
                                        <span className="text-base">🧩</span> Quiz
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div onClick={() => onMenuClick('market')} className="hover:text-white cursor-pointer transition">
                    {t.nav.market}
                </div>
                <div onClick={() => onMenuClick('rankings')} className="hover:text-white cursor-pointer transition">
                    {t.nav.ranking}
                </div>
            </div>

            {/* 3. 우측 유틸리티 섹션 (순서 재배치) */}
            <div className="flex items-center gap-6">
                {/* 언어 선택 팝다운 메뉴 */}
                <div className="relative">
                    <button
                        onClick={() => setIsLangToggleOpen(!isLangToggleOpen)}
                        className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-xs font-black hover:bg-white/10 transition"
                    >
                        🌐 {lang.toUpperCase()}
                    </button>

                    {isLangToggleOpen && (
                        <div className="absolute top-full right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-[60] w-32">
                            {languages.map((l) => (
                                <button
                                    key={l.code}
                                    onClick={() => { setLanguage(l.code); setIsLangToggleOpen(false); }}
                                    className={`block w-full px-6 py-3 text-left text-xs hover:bg-white/5 transition-colors ${lang === l.code ? 'text-purple-500 font-bold' : 'text-gray-400'}`}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 테마 모드 아이콘: 맨 오른쪽으로 배치 (Lock 바로 앞) */}
                <button
                    onClick={() => setIsDark(!isDark)}
                    className="p-2 text-xl hover:scale-110 transition-transform"
                    title="Toggle Theme"
                >
                    {isDark ? '☀️' : '🌙'}
                </button>

                {/* Lock 아이콘 (최우측 고정) */}
                <div
                    onClick={() => {
                        if (user) onMenuClick('account');
                        else onAuthClick();
                    }}
                    className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20 cursor-pointer active:scale-95 transition hover:bg-purple-500"
                    title={user ? "My Account" : "Login Required"}
                >
                    {user ? '👤' : '🔒'}
                </div>
            </div>
        </nav>
    );
}