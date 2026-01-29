import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../locales/languages';
import { supabase } from '../supabaseClient';

const Navbar = ({ onMenuClick, language, setLanguage, user, onAuthClick }) => {
    const [isPlayMenuOpen, setIsPlayMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const t = translations[language] || translations.ko;

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsAccountOpen(false);
    };

    return (
        <nav className="fixed top-0 w-full z-50 px-4 md:px-8 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center bg-black/60 backdrop-blur-3xl border border-white/10 px-6 py-3 rounded-[2.5rem] shadow-2xl">

                {/* 로고 영역 */}
                <div
                    onClick={() => onMenuClick('home')}
                    className="text-2xl font-black tracking-tighter text-white cursor-pointer select-none hover:opacity-80 transition"
                >
                    K-LINGUA <span className="text-purple-500">QUEST</span>
                </div>

                {/* 중앙 메뉴 (통합 컨트롤 타워) */}
                <div className="hidden md:flex gap-8 items-center text-sm font-bold">
                    {/* 1. 놀이마당 (팝다운 메뉴) */}
                    <div
                        className="relative group h-full flex items-center"
                        onMouseEnter={() => setIsPlayMenuOpen(true)}
                        onMouseLeave={() => setIsPlayMenuOpen(false)}
                    >
                        <button className="text-gray-300 hover:text-white transition flex items-center gap-1 py-4">
                            놀이마당 <span className="text-[10px] text-purple-500 transition-transform group-hover:rotate-180">▼</span>
                        </button>

                        <AnimatePresence>
                            {isPlayMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-56 z-50"
                                >
                                    <div className="bg-[#1a1a1a]/95 border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
                                        <ul className="flex flex-col text-sm font-medium text-gray-300">
                                            <li
                                                onClick={() => { onMenuClick('wordrain'); setIsPlayMenuOpen(false); }}
                                                className="px-6 py-4 hover:bg-purple-600 hover:text-white transition cursor-pointer border-b border-white/5 flex items-center gap-3"
                                            >
                                                <span className="text-lg">🌧️</span> 한글비 (Word Rain)
                                            </li>
                                            <li
                                                onClick={() => { onMenuClick('match'); setIsPlayMenuOpen(false); }}
                                                className="px-6 py-4 hover:bg-purple-600 hover:text-white transition cursor-pointer border-b border-white/5 flex items-center gap-3"
                                            >
                                                <span className="text-lg">🎴</span> 짝맞추기 (Match)
                                            </li>
                                            <li
                                                onClick={() => { onMenuClick('quiz'); setIsPlayMenuOpen(false); }}
                                                className="px-6 py-4 hover:bg-purple-600 hover:text-white transition cursor-pointer flex items-center gap-3"
                                            >
                                                <span className="text-lg">🧩</span> 글풀이 (Quiz)
                                            </li>
                                        </ul>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* 2. 장터마당 */}
                    <button
                        onClick={() => onMenuClick('market')}
                        className="text-gray-300 hover:text-white transition"
                    >
                        장터마당
                    </button>

                    {/* 3. 명예의 전당 (기존 기능 유지) */}
                    <button
                        onClick={() => onMenuClick('rankings')}
                        className="text-gray-300 hover:text-yellow-400 transition"
                    >
                        RANKINGS
                    </button>
                </div>

                {/* 우측 영역 (언어 + 계정) */}
                <div className="flex items-center space-x-6">
                    {/* 언어 선택 */}
                    <div className="relative">
                        <button onClick={() => setIsLangOpen(!isLangOpen)} className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 transition">
                            <span className="text-lg leading-none">🌐</span>
                            <span>{language.toUpperCase()}</span>
                        </button>
                        <AnimatePresence>
                            {isLangOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="absolute right-0 mt-2 w-32 bg-[#1a1a1a] border border-white/10 rounded-2xl p-1 shadow-2xl z-50 overflow-hidden"
                                >
                                    {Object.keys(translations).map(lang => (
                                        <button
                                            key={lang}
                                            onClick={() => { setLanguage(lang); setIsLangOpen(false); }}
                                            className={`w-full text-left px-4 py-2 hover:bg-white/10 rounded-xl text-xs font-bold flex items-center gap-2 ${language === lang ? 'text-purple-400' : 'text-gray-400'}`}
                                        >
                                            {lang.toUpperCase()}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* 계정 프로필 */}
                    <div className="relative">
                        <div
                            onClick={() => setIsAccountOpen(!isAccountOpen)}
                            className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-lg border border-purple-400/50 cursor-pointer hover:scale-110 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition select-none"
                        >
                            {user ? '👤' : '🔒'}
                        </div>

                        <AnimatePresence>
                            {isAccountOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                    className="absolute right-0 mt-4 w-56 bg-[#1a1a1a]/95 border border-white/10 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-xl"
                                >
                                    {!user ? (
                                        <>
                                            <button onClick={() => { onAuthClick(); setIsAccountOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-white/5 rounded-xl transition-all text-gray-300">
                                                {t.auth.login}
                                            </button>
                                            <button onClick={() => { onAuthClick(); setIsAccountOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-white/5 rounded-xl transition-all text-purple-400">
                                                {t.auth.signup}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="px-4 py-3 text-[10px] text-gray-500 border-b border-white/5 mb-1">
                                                <div className="truncate font-bold text-gray-300">{user.email.split('@')[0]}</div>
                                                <div className="truncate opacity-50">{user.email}</div>
                                            </div>
                                            <button onClick={() => { onMenuClick('account'); setIsAccountOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-purple-600/20 text-purple-300 hover:text-purple-200 rounded-xl transition-all mb-1 flex items-center gap-2">
                                                <span>⚙️</span> MY PAGE
                                            </button>
                                            <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-red-500/10 text-red-500 rounded-xl transition-all flex items-center gap-2">
                                                <span>🚪</span> LOGOUT
                                            </button>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;