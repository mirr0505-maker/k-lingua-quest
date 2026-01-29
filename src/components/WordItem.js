import React from 'react';

export const WordDisplay = ({ word, tier }) => {
    if (tier === 2) {
        const firstChar = word.charAt(0);
        const rest = word.slice(1);
        return (
            <div className="text-2xl text-center">
                <span className="font-black text-white">{firstChar}</span>
                <span className="text-gray-400 opacity-60">{rest}</span>
            </div>
        );
    }

    if (tier === 4) {
        // '매운 김치' -> ['매운', '김치'] 분리
        const parts = word.split(' ');
        if (parts.length < 2) return <div className="text-2xl text-white font-bold text-center">{word}</div>;

        return (
            <div className="text-2xl font-bold text-center">
                <span className="text-gray-500 opacity-60">{parts[0]}</span> {/* 형용사는 흐리게 */}
                <span className="text-white ml-2">{parts[1]}</span>           {/* 명사는 선명하게 */}
            </div>
        );
    }

    if (tier === 5) {
        return (
            <div className="text-2xl font-black text-purple-400 animate-pulse text-center">
                {word} {/* 5단계는 강조 효과 추가 */}
            </div>
        );
    }

    if (tier === 6) {
        return (
            <div className="text-2xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] animate-bounce text-center">
                {word} {/* 6단계: Master (Yellow Glow + Bounce) */}
            </div>
        );
    }

    // 3단계 및 기타: 힌트 없이 전체 흰색
    return <div className="text-2xl text-white font-bold text-center">{word}</div>;
};
