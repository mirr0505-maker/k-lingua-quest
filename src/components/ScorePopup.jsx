import React from 'react';

export const ScorePopup = ({ score, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="absolute top-36 right-12 z-[100] animate-bounce pointer-events-none">
            {/* 흑무영이 지시한 노란색 팝업 스타일 */}
            <div className="bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-2xl shadow-[0_0_20px_rgba(250,204,21,0.6)] border-4 border-white">
                +{score}
            </div>
        </div>
    );
};
