export const TIER_CONFIG = {
    1: {
        name: '입문',
        scoreRange: [0, 500],
        speeds: [0.5, 1.0], // 아주 느림 ~ 느림
        content: '자모음'
    },
    2: {
        name: '초보',
        scoreRange: [501, 1500],
        speeds: [1.0, 1.5], // 느림 ~ 보통
        content: '단어_힌트'
    },
    3: {
        name: '중수',
        scoreRange: [1501, 3000],
        speeds: [1.5, 2.0], // 보통 ~ 좀 빠름
        content: '순수_단어'
    },
    4: {
        name: '숙련',
        scoreRange: [3001, 5000],
        speeds: [1.5, 2.5], // 보통 ~ 빠름
        content: '복합_명사'
    },
    5: {
        name: '전문',
        scoreRange: [5001, 8000],
        speeds: [2.5, 3.5], // 빠름 ~ 아주 빠름
        content: '짧은_구절'
    },
    6: {
        name: '대가',
        scoreRange: [8001, Infinity],
        speeds: [0.5, 1.0, 1.5, 2.5, 3.5], // Chaos (전 속도 혼합)
        content: 'K-Culture'
    }
};
