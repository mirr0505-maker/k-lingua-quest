const TIER_SPEEDS = {
    1: [0.3, 0.6],    // 입문: 매우 천천히 (기초 익히기)
    2: [0.6, 1.0],    // 초보: 느림 ~ 보통 (힌트 보며 적응)
    3: [1.2, 1.8],    // 중수: 보통 ~ 조금 빠름 (순수 단어)
    4: [1.5, 2.2],    // 숙련: 조금 빠름 ~ 빠름 (복합 명사)
    5: [2.0, 3.0],    // 전문: 빠름 ~ 매우 빠름 (짧은 구절)
    6: [0.3, 1.2, 2.5, 3.5, 5.0] // Chaos: 전 속도 혼합 + 초고속 포함
};

/**
 * 티어와 점수에 기반한 단어 속도 결정 함수
 */
export const getDynamicSpeed = (tier) => {
    const possibleSpeeds = TIER_SPEEDS[tier] || TIER_SPEEDS[6];
    // 단계 내에서 무작위 속도 선택
    // 배열인 경우 무작위 선택, 아닐 경우(범위 등) 로직 확장 가능하나 현재는 배열 index random pick
    // 단, 제공된 로직이 범위([min, max])가 아니라 개별 값들의 집합이라면 아래 로직이 맞음.
    // 만약 범위라면 [min, max] 사이 랜덤 실수 생성 필요.
    // REQUEST의 형태는 [0.3, 0.6] 처럼 두 개만 있어 범위로 보일 수도 있으나, 6단계 예시([0.3, ..., 5.0])를 보면 '속도 프리셋 목록'임.
    // 따라서 Random Pick으로 구현.

    /* 
     * (Self-Correction): 1~5단계가 [min, max] 범위일 가능성도 있으나, 
     * 6단계가 명확히 discrete한 값들의 모음이므로, 
     * 일관성을 위해 1~5단계도 min~max 사이의 값을 랜덤하게 뽑는게 아니라 
     * "주어진 배열 내의 값 중 하나"를 뽑거나, "두 값 사이의 랜덤 실수"를 뽑는 것 중 하나로 해석해야 함.
     * 
     * 보통 게임 밸런스상 [min, max] 사이 랜덤이 자연스러움.
     * 6단계의 경우 "전 속도 혼합"이므로 0.3~5.0 사이 랜덤보다는, 
     * "아주 느림", "보통", "아주 빠름" 중 하나가 뚝 떨어지는 Chaos가 더 어울림.
     * 
     * 따라서 Hybrid 로직 적용:
     * 배열 길이가 2개이고 값이 작다면(=초기 단계) Range Random?
     * 하지만 Request 코드는 `Math.floor(Math.random() * possibleSpeeds.length)`로 "배열 픽"을 하고 있음.
     * => User Request 코드 그대로 구현 (Discrete Pick)
     */

    const randomIndex = Math.floor(Math.random() * possibleSpeeds.length);
    return possibleSpeeds[randomIndex];
};
