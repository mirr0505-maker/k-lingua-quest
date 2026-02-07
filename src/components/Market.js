import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Market({ language }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // DB 컬럼 매핑 (이전과 동일)
    const langMap = {
        ko: 'desc_ko',
        en: 'desc_en',
        ja: 'desc_ja',
        es: 'desc_es'
    };

    // 언어 코드 매핑 ('jp' -> 'ja' for DB column consistency)
    const langCode = language === 'jp' ? 'ja' : (language || 'en');

    useEffect(() => {
        fetchMarketItems();
    }, []);

    const fetchMarketItems = async () => {
        try {
            setLoading(true);
            // K-Food 데이터 가져오기 (전체 106개 데이터)
            const { data, error } = await supabase
                .from('vocabulary')
                .select('*')
                .order('id', { ascending: true }); // ID 순 정렬

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error('Error fetching market items:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-white text-center pt-20">Loading K-Food Collection...</div>;
    }

    return (
        <div className="w-full max-w-7xl mx-auto py-10 animate-in fade-in duration-700">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-black text-white mb-4 tracking-tight">K-Food Market</h1>
                <p className="text-gray-400">
                    {language === 'ko' ? "총 106개의 K-Food 컬렉션을 만나보세요." : "Explore the complete collection of 106 K-Foods."}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                    <div key={item.id} className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
                        {/* 이미지 연결 */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={item.image_url || 'https://via.placeholder.com/400x300?text=No+Image'}
                                alt={item.hangul}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                            />
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs text-white border border-white/10">
                                ID: {item.id}
                            </div>
                        </div>

                        <div className="p-5 space-y-3">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-black text-white group-hover:text-purple-400 transition-colors">
                                    {item.hangul}
                                </h2>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.difficulty <= 1 ? 'bg-green-500/20 text-green-400' :
                                        item.difficulty <= 3 ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-red-500/20 text-red-400'
                                    }`}>
                                    Level {item.difficulty}
                                </span>
                            </div>

                            {/* 설명 로직: 선택된 언어 우선, 없으면 영어 */}
                            <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 h-[4.5em]">
                                {item[langMap[langCode]] || item['desc_en'] || 'Translation in progress...'}
                            </p>

                            {/* 추가 정보 (영문명 등) - DB에 있다면 */}
                            {/* <p className="text-xs text-gray-600">{item.english}</p> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
