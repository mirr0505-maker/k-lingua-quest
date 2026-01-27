import React, { useState } from 'react';
import { translations } from '../locales/languages';

const Navbar = ({ onMenuClick, language, setLanguage }) => {
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    const t = translations[language] || translations.ko;
    const rawMenus = ['wordrain', 'match', 'quiz', 'sarang', 'suggest'];

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-xl border-b border-white/5 px-8 py-5 flex justify-between items-center">
            {/* 1. 로고 영역 */}
            <div onClick={() => { onMenuClick('home'); setIsAccountOpen(false); setIsLangOpen(false); }} className="text-xl font-black tracking-tighter cursor-pointer mr-6 flex-shrink-0">
                한글 <span className="text-purple-500 uppercase font-black">놀이마당</span>
            </div>

            {/* 2. 중앙 메뉴 영역: 한글 비, 짝 맞추기, 글 풀이, 사랑방 등 */}
            <div className="flex-grow flex justify-center space-x-12 text-[18px] font-black tracking-widest text-gray-500">
                {t.navbar.map((name, i) => (
                    <button
                        key={i}
                        onClick={() => onMenuClick(rawMenus[i])}
                        className="hover:text-white transition-all uppercase whitespace-nowrap"
                    >
                        {name}
                    </button>
                ))}
            </div>

            {/* 3. 우측 유틸리티 영역 */}
            <div className="flex items-center space-x-8 ml-6 flex-shrink-0">
                {/* 다국어 선택 */}
                <div className="relative">
                    <button
                        onClick={() => { setIsLangOpen(!isLangOpen); setIsAccountOpen(false); }}
                        className="text-sm font-black text-gray-400 hover:text-white uppercase flex items-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                        <span>{language.toUpperCase()}</span>
                    </button>
                    {isLangOpen && (
                        <div className="absolute right-0 mt-8 w-40 bg-[#1a1a1a] border border-white/10 rounded-2xl p-2 z-50 shadow-2xl">
                            {['ko', 'en', 'es', 'jp'].map(l => (
                                <button
                                    key={l}
                                    onClick={() => { setLanguage(l); setIsLangOpen(false); }}
                                    className={`w-full text-left px-4 py-2 rounded-lg text-sm uppercase ${language === l ? 'bg-purple-600 text-white' : 'hover:bg-white/5 text-gray-400'}`}
                                >
                                    {l === 'ko' ? '한국어' : l.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 로그인 / 회원가입 통합 버튼 */}
                <div className="relative">
                    <button
                        onClick={() => { setIsAccountOpen(!isAccountOpen); setIsLangOpen(false); }}
                        className="text-[13px] font-black text-white bg-purple-600 px-6 py-2.5 rounded-full hover:bg-purple-500 transition-all tracking-tighter flex items-center shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                    >
                        {t.accountLabel} <span className="text-[18px] ml-2 mt-1">↓</span>
                    </button>

                    {isAccountOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-[#1a1a1a] border border-white/10 shadow-2xl rounded-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                            <button className="w-full text-left px-4 py-2.5 text-[12px] font-black hover:bg-white/5 text-gray-300 rounded-xl transition uppercase">
                                {t.login}
                            </button>
                            <div className="h-px bg-white/5 mx-2" />
                            <button className="w-full text-left px-4 py-2.5 text-[12px] font-black hover:bg-white/5 text-purple-400 rounded-xl transition uppercase">
                                {t.signup}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;