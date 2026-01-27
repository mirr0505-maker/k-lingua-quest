import React, { useState } from 'react';
import { translations } from '../locales/languages';
import { supabase } from '../supabaseClient';

const Navbar = ({ onMenuClick, language, setLanguage, user, onAuthClick }) => {
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const t = translations[language] || translations.ko;

    const menus = ['wordrain', 'match', 'quiz', 'sarang', 'suggest'];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsAccountOpen(false);
    };

    return (
        <nav className="fixed top-0 w-full z-50 px-8 py-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center bg-black/60 backdrop-blur-3xl border border-white/10 px-8 py-4 rounded-[2.5rem] shadow-2xl">

                {/* 로고 */}
                <div onClick={() => onMenuClick('home')} className="text-xl font-black tracking-tighter cursor-pointer">
                    한글 <span className="text-purple-500 uppercase">놀이마당</span>
                </div>

                {/* 중앙 메뉴 (간격 최적화) */}
                <div className="flex space-x-8 text-[15px] font-bold text-gray-400">
                    {t.navbar.map((name, i) => (
                        <button key={i} onClick={() => onMenuClick(menus[i])} className="hover:text-white transition-all uppercase tracking-tight">
                            {name}
                        </button>
                    ))}
                    <button onClick={() => onMenuClick('rankings')} className="hover:text-purple-400 transition-all uppercase tracking-tight font-black">
                        {language === 'ko' ? '명예의 전당' : 'RANKINGS'}
                    </button>
                </div>

                {/* 우측 영역 (국기 + 계정 팝다운) */}
                <div className="flex items-center space-x-6">
                    {/* 다국어 선택 (지구본 아이콘 + 언어 코드) */}
                    <div className="relative">
                        <button onClick={() => setIsLangOpen(!isLangOpen)} className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                            <span>{language.toUpperCase()}</span>
                        </button>
                        {isLangOpen && (
                            <div className="absolute right-0 mt-4 w-32 bg-[#111] border border-white/10 rounded-2xl p-2 shadow-2xl z-50">
                                {Object.keys(translations).map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => { setLanguage(lang); setIsLangOpen(false); }}
                                        className={`w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl text-xs font-bold flex items-center gap-2 ${language === lang ? 'text-purple-400' : 'text-gray-400'}`}
                                    >
                                        {lang.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 계정 팝다운 (압축 디자인) */}
                    <div className="relative">
                        <button
                            onClick={() => setIsAccountOpen(!isAccountOpen)}
                            className="px-6 py-2.5 bg-purple-600 rounded-full text-xs font-black tracking-widest hover:bg-purple-500 transition-all flex items-center"
                        >
                            {user ? (user.email.split('@')[0]) : t.accountLabel} <span className="ml-2">↓</span>
                        </button>

                        {isAccountOpen && (
                            <div className="absolute right-0 mt-4 w-48 bg-[#111] border border-white/10 rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                                {!user ? (
                                    <>
                                        <button onClick={() => { onAuthClick(); setIsAccountOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-white/5 rounded-xl transition-all">
                                            {t.auth.login}
                                        </button>
                                        <button onClick={() => { onAuthClick(); setIsAccountOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-white/5 rounded-xl transition-all text-purple-400">
                                            {t.auth.signup}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="px-4 py-2 text-[10px] text-gray-500 border-b border-white/5 mb-1 italic truncate">{user.email}</div>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-red-500/10 rounded-xl transition-all text-red-500">
                                            LOGOUT
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};


export default Navbar;