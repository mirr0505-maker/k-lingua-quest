import React, { useState } from 'react';
import { translations } from '../locales/languages';
import RankingBoard from './RankingBoard';

const WordRainLobby = ({ language, onStart, unlockedLevel = 1 }) => {
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [mode, setMode] = useState('hangeul');

    // App.js에서 전달받은 language 상태에 따라 즉시 데이터 동기화
    const t = translations[language] || translations.ko;
    const lobbyData = t.lobby;

    if (!lobbyData) return <div className="text-white">Loading...</div>;

    return (
        <div className="relative min-h-[70vh] rounded-[3rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md animate-in fade-in duration-700">
            <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1540962351504-03099e0a75c3?q=80" className="w-full h-full object-cover opacity-20 blue-filter" alt="Lobby BG" />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black" />
            </div>

            <div className="relative z-10 p-16 flex flex-col items-center">
                <h2 className="text-4xl font-black mb-2 tracking-tighter">
                    {lobbyData.title} <span className="text-blue-400 text-lg ml-2 font-light">{lobbyData.subTitle}</span>
                </h2>
                <p className="text-gray-400 mb-12 italic">{lobbyData.desc}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
                    {lobbyData.levels.map((l) => {
                        // 전략적 판정: unlockedLevel보다 작거나 같으면 해제
                        const isActuallyLocked = l.id > unlockedLevel;

                        return (
                            <div
                                key={l.id}
                                onClick={() => !isActuallyLocked && setSelectedLevel(l.id)}
                                className={`p-6 rounded-2xl border transition-all ${selectedLevel === l.id ? 'border-purple-500 bg-purple-500/10' :
                                    isActuallyLocked ? 'border-white/5 opacity-20 cursor-not-allowed' : 'border-white/10 bg-white/5 hover:border-white/30'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs font-black px-2 py-1 bg-white/10 rounded-md uppercase tracking-widest">Level 0{l.id}</span>
                                    {isActuallyLocked && <span className="text-[10px] text-red-500 font-bold uppercase">Locked 🔒</span>}
                                </div>
                                <h3 className="text-xl font-bold mb-1">{l.name}</h3>
                                <p className="text-gray-500 text-xs font-light">{l.desc}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="flex space-x-4 mb-12">
                    <button
                        onClick={() => setMode('hangeul')}
                        className={`px-8 py-3 rounded-full text-xs font-black tracking-widest transition-all ${mode === 'hangeul' ? 'bg-white text-black' : 'border border-white/20 text-gray-500'}`}
                    >
                        {lobbyData.modeHangeul}
                    </button>
                    <button
                        disabled={selectedLevel === 1}
                        onClick={() => setMode('meaning')}
                        className={`px-8 py-3 rounded-full text-xs font-black tracking-widest transition-all ${selectedLevel === 1 ? 'opacity-20 cursor-not-allowed' : mode === 'meaning' ? 'bg-white text-black' : 'border border-white/20 text-gray-500'}`}
                    >
                        {lobbyData.modeMeaning}
                    </button>
                </div>

                <button
                    onClick={() => onStart({ level: selectedLevel, mode })}
                    className="group relative px-16 py-5 bg-purple-600 rounded-full text-xl font-black tracking-[0.5rem] hover:bg-purple-500 transition-all shadow-[0_0_30px_rgba(168,85,247,0.4)] mb-16"
                >
                    {lobbyData.startBtn}
                    <span className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:-right-4 transition-all">→</span>
                </button>

                {/* 글로벌 랭킹 보드 탑재 */}
                <div className="mt-20 w-full max-w-4xl">
                    <RankingBoard language={language} />
                </div>
            </div>
        </div>
    );
};

// 핵심 교정: 파일의 주인공으로 컴포넌트를 내보냄
export default WordRainLobby;