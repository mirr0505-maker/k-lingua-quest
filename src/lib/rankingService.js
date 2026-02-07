import { supabase } from '../supabaseClient';

export const saveHighScore = async (userId, score, metadata = {}) => {
    try {
        // 1. 현재 최고 점수 확인
        const { data: currentRecord } = await supabase
            .from('hangeul_rankings')
            .select('score')
            .eq('user_id', userId)
            .single();

        // 2. 신기록일 경우에만 저장 실행
        if (!currentRecord || score > currentRecord.score) {
            const { error } = await supabase
                .from('hangeul_rankings')
                .upsert({
                    user_id: userId,
                    score: score,
                    updated_at: new Date().toISOString(),
                    ...metadata // nickname, country_code, level 등 추가 정보 저장
                }, { onConflict: 'user_id' });

            if (error) throw error;
            return { success: true, isNewRecord: true };
        }
        return { success: true, isNewRecord: false };
    } catch (error) {
        console.error("기록 저장 실패:", error.message);
        return { success: false, error: error.message };
    }
};
