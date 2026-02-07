// components/Navbar/LiveTicker.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function LiveTicker({ lang }) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // 실시간 구독: 신기록 탄생 시 메시지 추가
        const channel = supabase
            .channel('ranking_ticker')
            .on('postgres_changes', { event: 'INSERT', table: 'hangeul_rankings' }, (payload) => {
                // user_name이 아니라 nickname일 가능성이 높으므로 둘 다 체크
                const userName = payload.new.nickname || payload.new.user_name || 'Player';
                const newMsg = `🎉 NEW RECORD! ${userName} reached ${payload.new.score}pts!`;
                setMessages(prev => [...prev, newMsg]);
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    return (
        <div className="overflow-hidden bg-purple-900/30 py-1 border-y border-purple-500/20">
            <div className="flex whitespace-nowrap animate-marquee-infinite">
                {/* 우에서 좌로 무한 반복되는 메시지 스트림 */}
                <div className="flex gap-20 items-center px-10">
                    {messages.length > 0 ? messages.map((m, i) => (
                        <span key={i} className="text-yellow-400 font-bold text-sm">
                            {m}
                        </span>
                    )) : <span className="text-gray-500">K-Lingua Quest: Ready for the next challenger!</span>}
                </div>
            </div>
        </div>
    );
}
