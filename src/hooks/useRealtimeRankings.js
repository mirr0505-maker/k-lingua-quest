import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export const useRealtimeRankings = () => {
    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        // 1. 초기 랭킹 로드 (Top 5)
        const fetchInitialRankings = async () => {
            // note: adapted to use existing schema columns nickname, country_code directly
            // unless profiles relation is confirmed, staying safe with direct columns
            // If direct columns were used in insert, they should be here.
            // However, if the user explicitly wants join, it usually implies the table structure changed.
            // Let's assume the previous insert logic in WordRainGame is the source of truth for now.
            // It inserted nickname and country_code into hangeul_rankings.
            const { data, error } = await supabase
                .from('hangeul_rankings')
                .select('id, user_id, score, nickname, country_code')
                .order('score', { ascending: false })
                .limit(5);

            if (data) setRankings(data);
            if (error) console.error("Error fetching rankings:", error);
        };

        fetchInitialRankings();

        // 2. 실시간 구독 (새 점수 등록 시 자동 갱신)
        const channel = supabase
            .channel('realtime_rankings')
            .on('postgres_changes',
                { event: '*', table: 'hangeul_rankings' },
                () => fetchInitialRankings()
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    return rankings;
};
