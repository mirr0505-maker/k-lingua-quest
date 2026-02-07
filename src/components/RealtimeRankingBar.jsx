import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { translations } from '../constants/languages';

export default function RealtimeRankingBar({ lang }) {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Use 'ko' as fallback language if 'lang' is undefined or invalid
    const validLang = translations[lang] ? lang : 'ko';
    const t = translations[validLang];

    useEffect(() => {
        // 1. 초기 데이터 가져오기
        fetchRankings();

        // 2. 실시간 구독 설정 (Insert/Update 발생 시 자동 갱신)
        const subscription = supabase
            .channel('ranking_changes')
            .on('postgres_changes', { event: '*', table: 'hangeul_rankings' }, (payload) => {
                fetchRankings();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchRankings = async () => {
        const { data } = await supabase
            .from('hangeul_rankings')
            .select('*')
            .order('score', { ascending: false })
            .limit(5);

        setRankings(data || []);
        setLoading(false);
    };

    return (
        <div className="w-full bg-purple-900/40 border-y border-purple-500/30 py-4 overflow-hidden backdrop-blur-md shadow-inner">
            <div className="flex whitespace-nowrap animate-marquee relative min-h-[1.5rem] items-center">
                {loading ? (
                    <div className="w-full text-center text-xs font-black text-purple-300 animate-pulse tracking-[0.5em] uppercase">
                        Initializing Global War Room...
                    </div>
                ) : rankings.length > 0 ? (
                    // 데이터가 있을 때 무한 루프 구현 (복제본 생성)
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="flex space-x-40 items-center px-20">
                            {rankings.map((rank, idx) => (
                                <span key={idx} className="flex items-center space-x-6">
                                    <span className="text-purple-500 font-black italic text-xs">#0{idx + 1}</span>
                                    {/* 국기 렌더링 로직 추가 필요 시 여기에 getFlag 구현 또는 import */}
                                    <span className="text-white font-black tracking-widest">{rank.nickname}</span>
                                    <span className="text-cyan-400 font-mono font-black">{rank.score.toLocaleString()}</span>
                                </span>
                            ))}
                        </div>
                    ))
                ) : (
                    /* 데이터가 없을 경우 해당 언어로 변환하여 출력 */
                    <span className="w-full text-center text-xs font-black text-gray-500 italic animate-pulse tracking-widest">
                        {t.no_data || "No Data"}
                    </span>
                )}
            </div>
        </div>
    );
}
