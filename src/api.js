import { supabase } from './supabaseClient';

export const fetchWordsByCategory = async (category, lang) => {
    const { data, error } = await supabase
        .rpc('get_words_by_category', {
            selected_category: category,
            limit_num: 30
        });

    if (error || !data) {
        console.error("데이터 로드 실패:", error);
        return [];
    }

    return data.map(item => ({
        // 핵심 수정: item.hangul (스크린샷의 컬럼명과 일치)
        text: item.hangul || "데이터오류",
        translation: item[`meaning_${lang}`] || item.meaning,
        speed: (Math.random() * 0.6 + 0.4)
    }));
};
