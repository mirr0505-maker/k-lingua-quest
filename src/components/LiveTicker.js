
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const LiveTicker = () => {
    const [topRankers, setTopRankers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTopRankers = async () => {
            setIsLoading(true);
            const { data } = await supabase
                .from('hangeul_rankings')
                .select('nickname, score, country_code')
                .order('score', { ascending: false })
                .limit(5);
            setTopRankers(data || []);
            setIsLoading(false);
        };
        fetchTopRankers();
        const interval = setInterval(fetchTopRankers, 30000);
        return () => clearInterval(interval);
    }, []);

    const getFlag = (code) => {
        try {
            return code.toUpperCase().replace(/./g, char =>
                String.fromCodePoint(char.charCodeAt(0) + 127397)
            );
        } catch { return "🌐"; }
    };

    return (
        <div className="w-full bg-purple-900/40 border-y border-purple-500/30 py-4 overflow-hidden backdrop-blur-md shadow-inner">
            <div className="flex whitespace-nowrap animate-marquee relative min-h-[1.5rem] items-center">
                {isLoading ? (
                    // 로딩 중일 때도 중앙에서 확실히 보이게 처리
                    <div className="w-full text-center text-xs font-black text-purple-300 animate-pulse tracking-[0.5em] uppercase">
                        Initializing Global War Room...
                    </div>
                ) : topRankers.length > 0 ? (
                    // 데이터가 있을 때 무한 루프 구현 (복제본 생성)
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="flex space-x-40 items-center px-20">
                            {topRankers.map((rank, idx) => (
                                <span key={idx} className="flex items-center space-x-6">
                                    <span className="text-purple-500 font-black italic text-xs">#0{idx + 1}</span>
                                    <span className="text-2xl filter drop-shadow-md">{getFlag(rank.country_code)}</span>
                                    <span className="text-white font-black tracking-widest">{rank.nickname}</span>
                                    <span className="text-cyan-400 font-mono font-black">{rank.score.toLocaleString()}</span>
                                </span>
                            ))}
                        </div>
                    ))
                ) : (
                    // 데이터가 없을 때 표시할 기본 메세지
                    <div className="w-full text-center text-xs font-black text-gray-500 tracking-[0.3em] uppercase px-20">
                        NO ACTIVE BATTLE RECORDS FOUND. BE THE FIRST LEGEND!
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveTicker;
