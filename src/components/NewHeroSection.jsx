import React, { useMemo, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function NewHeroSection({ lang }) {
    const [kFoods, setKFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. 언어 코드 매핑 ('jp' -> 'ja' for DB column consistency)
    const langCode = useMemo(() => {
        if (lang === 'jp') return 'ja';
        return lang || 'ko'; // 기본값 ko
    }, [lang]);

    useEffect(() => {
        fetchTop10KFoods();
    }, []);

    const fetchTop10KFoods = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('k_vocabulary')
                .select('*')
                .eq('category', 'K-Food')
                .order('id', { ascending: true })
                .limit(10);

            if (error) throw error;
            setKFoods(data || []);
        } catch (error) {
            console.error('Error fetching Top 10 K-Foods:', error);
        } finally {
            setLoading(false);
        }
    };

    // 2. 텍스트 결정 로직 (4 Rows)
    const getTexts = (food) => {
        // Row 1: 한글 이름 (무조건 한글)
        const row1 = food.hangul || food.name_ko;

        // Row 2: 의미/단어 (언어별)
        let row2;
        if (langCode === 'en') row2 = food.meaning || food.romanization;
        else if (langCode === 'ja') row2 = food.meaning_jp || food.romanization;
        else if (langCode === 'es') row2 = food.meaning_es || food.romanization;
        else if (langCode === 'ko') row2 = food.romanization; // 한국어일 땐 로마자(영어이름) 표기
        else row2 = food.meaning || food.romanization;

        // Row 3: 해당 언어 설명
        const row3 = food[`desc_${langCode}`] || food.desc_ko;

        // Row 4: 한글 설명 (선택된 언어가 한국어면 영어 설명으로 대체하여 중복 방지)
        const row4 = langCode === 'ko' ? food.desc_en : food.desc_ko;

        return { row1, row2, row3, row4 };
    };

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Top 10...</div>;
    }

    return (
        <section className="relative flex justify-center px-4 py-10 bg-black min-h-screen">
            {/* 배경 네온 효과 */}
            <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/05 rounded-full blur-[120px] pointer-events-none" />

            {/* 좌측 광고 영역 (Fixed로 변경하여 스크롤 시 따라오도록 함) */}
            <div className="hidden xl:flex flex-col w-[160px] h-[600px] fixed top-32 left-10 border border-white/10 rounded-xl items-center justify-center bg-white/5 backdrop-blur-sm text-gray-500 text-sm font-mono z-20">
                Google Ads
                <br /><span className="text-xs text-gray-700">(Vertical)</span>
            </div>

            {/* 우측 광고 영역 (Fixed) */}
            <div className="hidden xl:flex flex-col w-[160px] h-[600px] fixed top-32 right-10 border border-white/10 rounded-xl items-center justify-center bg-white/5 backdrop-blur-sm text-gray-500 text-sm font-mono z-20">
                Google Ads
                <br /><span className="text-xs text-gray-700">(Vertical)</span>
            </div>

            {/* 메인 컨텐츠 영역 */}
            <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center">

                {/* 헤더 섹션 */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <span className="text-purple-500 font-bold tracking-[0.5em] text-xs uppercase block mb-2">K-Culture Collection</span>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                        Top 10 K-Foods
                    </h1>
                    <p className="text-gray-400 text-sm md:text-sm font-light">
                        {lang === 'ko' ? "한국을 대표하는 10가지 맛" : "10 Tastes Representing Korea"}
                    </p>
                </div>

                <div className="flex flex-col space-y-12 w-full">
                    {kFoods.map((food, index) => {
                        const { row1, row2, row3, row4 } = getTexts(food);

                        return (
                            <div
                                key={food.id}
                                className="flex flex-col md:flex-row items-center gap-6 md:gap-10 group"
                            >
                                {/* 좌측: 음식 사진 */}
                                <div className="w-full md:w-5/12 relative">
                                    <div className="w-full h-40 md:h-48 rounded-xl overflow-hidden border border-white/10 shadow-xl group-hover:border-purple-500/30 transition-colors duration-500 relative">
                                        <img
                                            src={food.image_url}
                                            alt={row1}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                                        <div className="absolute top-2 left-4 font-black text-white/20 text-5xl leading-none italic select-none">
                                            {String(index + 1).padStart(2, '0')}
                                        </div>
                                    </div>
                                </div>

                                {/* 우측: 텍스트 (4 Rows) */}
                                <div className="w-full md:w-7/12 text-left space-y-2">
                                    {/* 1st Row: Hangul (Big) */}
                                    <h2 className="text-3xl md:text-4xl font-black text-white leading-tight group-hover:text-purple-400 transition-colors duration-300">
                                        {row1}
                                    </h2>

                                    {/* 2nd Row: Meaning/Romanization (Medium, Italic) */}
                                    <h3 className="text-lg md:text-xl text-purple-400 font-serif italic mb-4">
                                        {row2}
                                    </h3>

                                    <div className="w-8 h-[1px] bg-white/20 group-hover:w-16 group-hover:bg-purple-500 transition-all duration-500 my-3" />

                                    <div className="space-y-1">
                                        {/* 3rd Row: Desc in Target Lang */}
                                        <p className="text-base text-gray-200 font-medium leading-relaxed break-keep">
                                            {row3}
                                        </p>

                                        {/* 4th Row: Desc in Korean (Small, Gray) */}
                                        <p className="text-xs text-gray-500 font-light leading-relaxed">
                                            {row4}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 하단 광고 영역 (New) */}
                <div className="w-full h-[250px] border border-white/10 rounded-xl flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm text-gray-500 text-sm font-mono mt-24 mb-10">
                    Google Ads
                    <span className="text-xs text-gray-700 mt-2">(Horizontal Banner)</span>
                </div>

                <div className="h-16 flex items-center justify-center text-white/20 mt-4">
                    <span className="tracking-widest text-[10px]">K-LINGUA QUEST</span>
                </div>
            </div>
        </section>
    );
}
