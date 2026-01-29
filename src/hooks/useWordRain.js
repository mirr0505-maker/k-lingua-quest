import { TIER_CONFIG } from '../constants/gameConfig';

// Mock function for getting words (Replace with actual data fetching logic later)
const getWordByTier = (tierLevel, dbWords, basicChars) => {
    // If the word list is empty or dbWords isn't ready
    if (tierLevel === '1' || tierLevel === 1) {
        return basicChars[Math.floor(Math.random() * basicChars.length)];
    }

    if (!dbWords || dbWords.length === 0) return '준비중';

    // In a real scenario, you might filter dbWords by complexity here
    // For now, return a random word from the pre-loaded set
    const randomWord = dbWords[Math.floor(Math.random() * dbWords.length)];
    return randomWord ? (randomWord.text || randomWord.hangeul) : '오류';
};

export const generateNewWord = (currentScore, dbWords, basicChars, language, mode) => {
    // 1. 현재 점수에 맞는 티어 계산
    const tierLevel = Object.keys(TIER_CONFIG).find(t =>
        currentScore >= TIER_CONFIG[t].scoreRange[0] &&
        currentScore <= TIER_CONFIG[t].scoreRange[1]
    ) || 6;

    const config = TIER_CONFIG[tierLevel];

    // 2. 단계 내 속도 랜덤 추출
    const randomSpeed = config.speeds[Math.floor(Math.random() * config.speeds.length)];

    // Get word text based on tier logic
    const wordText = getWordByTier(tierLevel, dbWords, basicChars);

    // Determine meaning (simulated for generating full word object structure used in Game)
    // In the real game loop, we need to match this structure with what HangeulRain expects

    let targetData = dbWords.find(w => (w.text === wordText || w.hangeul === wordText));
    if (!targetData && tierLevel == 1) {
        targetData = { hangeul: wordText, meaning: wordText }; // Basic char fallback
    }

    let currentMeaning = targetData?.meaning || wordText;
    if (language === 'es' && targetData?.meaning_es) currentMeaning = targetData.meaning_es;
    if (language === 'jp' && targetData?.meaning_jp) currentMeaning = targetData.meaning_jp;

    const displayText = mode === 'hangeul' ? (targetData?.hangeul || wordText) : currentMeaning;

    return {
        text: displayText,
        meaning: mode === 'hangeul' ? currentMeaning : (targetData?.hangeul || wordText),
        speed: randomSpeed,
        x: Math.random() * 80 + 10, // 좌우 10~90% 위치 (Logic handled in Canvas usually, but passed here as config)
        tier: tierLevel
    };
};
