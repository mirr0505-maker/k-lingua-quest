import React from 'react';
import { useRealtimeRankings } from '../hooks/useRealtimeRankings';
import { translations } from '../constants/languages';

export default function RankingTicker({ lang }) {
    const rankings = useRealtimeRankings();
    const validLang = translations[lang] ? lang : 'ko';
    const t = translations[validLang];

    if (rankings.length === 0) {
        return <div className="text-gray-500 text-xs italic w-full text-center py-2">{t.no_data}</div>;
    }

    // Double the ranks to ensure seamless marquee if needed, or just map once if using CSS logic similar to before
    // The user provided code does a simple map. I will stick to their structure but ensure wrapper style matches.
    return (
        <div className="w-full bg-purple-900/40 border-y border-purple-500/30 py-2 overflow-hidden backdrop-blur-md shadow-inner flex items-center">
            <div className="flex gap-12 animate-marquee whitespace-nowrap px-4">
                {[...rankings, ...rankings].map((rank, index) => (
                    <div key={`${rank.id}-${index}`} className="flex gap-2 items-center text-xs">
                        <span className="text-purple-400 font-black">#{(index % rankings.length) + 1}</span>
                        <span className="text-gray-400 uppercase font-mono tracking-wider">{rank.country_code || '??'}</span>
                        <span className="text-white font-bold">{rank.nickname || 'Guest'}</span>
                        <span className="text-purple-300 font-mono">{rank.score.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
