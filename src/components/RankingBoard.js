import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { translations } from '../constants/languages';
import { getLocalizedTier } from '../utils/localization';

const emptyMessages = {
    ko: "현재 전장에 등록된 기록이 없습니다. 첫 번째 정복자가 되십시오!",
    en: "No records found in the war room. Be the first conqueror!",
    jp: "現在、戦場に登録された記録がありません。最初の征服者になってください！",
    es: "¡No se han encontrado registros en la sala de guerra. ¡Sé el primero en conquistar!"
};

const RankingBoard = ({ language }) => {
    const t = translations[language] || translations.ko;
    const [activeTab, setActiveTab] = useState(1); // 단계별 필터링
    const [rankings, setRankings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRankings = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('hangeul_rankings')
                .select('*')
                .eq('level', activeTab)
                .order('score', { ascending: false })
                .limit(10);

            if (!error) setRankings(data || []);
            setIsLoading(false);
        };
        fetchRankings();
    }, [activeTab]);

    const getFlag = (code) => {
        try {
            return code.toUpperCase().replace(/./g, char =>
                String.fromCodePoint(char.charCodeAt(0) + 127397)
            );
        } catch { return "🌐"; }
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-white via-purple-400 to-white bg-clip-text text-transparent italic">
                    {t.rank_title}
                </h2>
                <div className="h-1 w-24 bg-purple-600 mx-auto mt-4 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.5)]"></div>
            </div>

            {/* 단계별 탭 (럭셔리 필터) */}
            <div className="flex justify-center space-x-4 mb-10">
                {[1, 2, 3].map(lvl => (
                    <button
                        key={lvl}
                        onClick={() => setActiveTab(lvl)}
                        className={`px-8 py-3 rounded-full text-xs font-black tracking-[0.2em] transition-all ${activeTab === lvl ? 'bg-purple-600 text-white shadow-[0_0_30px_rgba(147,51,234,0.4)]' : 'bg-white/5 text-gray-500 hover:bg-white/10'
                            }`}
                    >
                        LEVEL 0{lvl}
                    </button>
                ))}
            </div>

            {/* 랭킹 리스트 (유리 질감 카드) */}
            <div className="grid gap-4 min-h-[400px]">
                {isLoading ? (
                    <div className="flex items-center justify-center text-purple-400 animate-pulse font-black">
                        SCANNING GLOBAL DATA...
                    </div>
                ) : rankings.length > 0 ? (
                    rankings.map((rank, i) => (
                        <div key={rank.id} className="group relative overflow-hidden bg-gradient-to-r from-white/5 to-transparent backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex items-center justify-between hover:border-purple-500/50 transition-all duration-500">
                            <div className="flex items-center space-x-8">
                                <span className={`text-3xl font-black italic ${i < 3 ? 'text-purple-500' : 'text-white/20'}`}>
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <div className="text-4xl filter drop-shadow-lg">{getFlag(rank.country_code)}</div>
                                <div>
                                    <p className="text-sm text-gray-400 font-bold tracking-widest uppercase mb-1">{t.rank_player}</p>
                                    <h4 className="text-xl font-black text-white">{rank.nickname}</h4>
                                    <span className="inline-block mt-2 px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-[10px] font-bold tracking-wider">
                                        {getLocalizedTier(rank.level, language)}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-purple-400 font-black tracking-[0.3em] mb-1">{t.rank_score}</p>
                                <p className="text-3xl font-mono font-black text-white tracking-tighter">
                                    {rank.score.toLocaleString()}
                                </p>
                            </div>
                            {/* 1등 전용 아우라 */}
                            {i === 0 && <div className="absolute inset-0 bg-purple-500/5 animate-pulse pointer-events-none"></div>}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[3rem] bg-white/[0.02]">
                        <div className="text-4xl mb-4 opacity-30">🛡️</div>
                        <p className="text-sm font-bold text-gray-500 tracking-widest text-center px-10">
                            {emptyMessages[language] || emptyMessages.en}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RankingBoard;
