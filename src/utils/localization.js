import { translations } from '../constants/languages';

/**
 * DB의 티어 코드를 현재 언어에 맞는 명칭으로 변환
 * @param {number} tierLevel - DB에서 넘어온 티어 레벨 (1~6)
 * @param {string} lang - 현재 선택된 언어 코드
 */
export const getLocalizedTier = (tierLevel, lang) => {
    const t = translations[lang] || translations.ko;
    // tier_1, tier_2... 형태의 키를 찾음. 기본값은 tier_1
    return t[`tier_${tierLevel}`] || t.tier_1;
};
