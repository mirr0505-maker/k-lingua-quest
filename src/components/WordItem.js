import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 내부 로직용 심화 디스플레이 컴포넌트
const AdvancedWordDisplay = ({ word, tier }) => {
    // Use Tailwind dark mode classes
    const textColor = 'text-slate-900 dark:text-white';
    const subColor = 'text-slate-500 dark:text-gray-400';

    if (tier === 2) {
        const firstChar = word.charAt(0);
        const rest = word.slice(1);
        return (
            <div className="text-xl text-center leading-none">
                <span className={`font-black ${textColor}`}>{firstChar}</span>
                <span className={`${subColor} opacity-60`}>{rest}</span>
            </div>
        );
    }

    if (tier === 4) {
        // '매운 김치' -> ['매운', '김치'] 분리
        const parts = word.split(' ');
        if (parts.length < 2) return <div className={`text-xl font-bold text-center ${textColor}`}>{word}</div>;

        return (
            <div className="text-xl font-bold text-center leading-none">
                <span className={`${subColor} opacity-70`}>{parts[0]}</span> {/* 형용사는 흐리게 */}
                <span className={`${textColor} ml-1`}>{parts[1]}</span>           {/* 명사는 선명하게 */}
            </div>
        );
    }

    if (tier === 5) {
        return (
            <div className="text-xl font-black text-purple-500 animate-pulse text-center leading-none">
                {word} {/* 5단계는 강조 효과 추가 */}
            </div>
        );
    }

    if (tier === 6) {
        return (
            <div className={`text-xl font-black drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] animate-bounce text-center leading-none text-yellow-600 dark:text-yellow-400`}>
                {word} {/* 6단계: Master (Yellow Glow + Bounce) */}
            </div>
        );
    }

    // 3단계 및 기타: 힌트 없이 전체 단색
    return <div className={`text-xl font-bold text-center leading-none ${textColor}`}>{word}</div>;
};

// 외부에서 사용할 물방울 컴포넌트
export const WordBubble = ({ word, tier, isMatched }) => {
    // 단어 길이에 따른 동적 크기 계산 (4단계 복합어 고려)
    const bubbleSize = word.length > 4 ? 'w-32 h-32' : 'w-24 h-24';

    return (
        <AnimatePresence>
            {!isMatched ? (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{
                        scale: 1.5,      // 톡 터지는 순간 확장
                        opacity: 0,      // 투명하게 소멸
                        filter: "blur(10px)", // 터지면서 흐릿해짐
                        transition: { duration: 0.2 }
                    }}
                    className={`k-bubble ${bubbleSize} flex flex-col items-center justify-center relative shadow-lg`}
                >
                    {/* 2단계 힌트 및 4단계 형용사 처리 로직 포함 */}
                    <AdvancedWordDisplay word={word} tier={tier} />

                    {/* 물방울 상단 반사광 효과 - User Request */}
                    <div className="absolute top-2 left-4 w-4 h-2 bg-white/30 rounded-full rotate-[-20deg]" />
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};

// 하위 호환성을 위해 기존 이름으로도 내보내지만, 실제로는 Bubble을 사용하지 않는 경우를 대비해 껍데기만 유지하거나, 
// 혹은 사용처에서 WordBubble로 교체해야 함. 현재로선 WordRainGame에서 import { WordDisplay } ... 형태로 쓰고 있을 것임.
// 일단 WordDisplay를 유지하되 내용은 단순 텍스트만 보여주거나, Bubble로 래핑할지 결정해야 함.
// 유저 의도는 '게임 엔진 내 물방울 컴포넌트 적용'이므로, WordDisplay를 WordBubble로 교체하는 것이 맞음.
// 여기서는 WordDisplay를 WordBubble의 별칭으로 export하여 기존 코드가 깨지지 않게 하면서 즉시 적용되게 함.
export const WordDisplay = WordBubble;
