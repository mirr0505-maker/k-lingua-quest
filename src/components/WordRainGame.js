import React, { useState, useEffect, useRef } from 'react';
import { translations } from '../locales/languages';
import { supabase } from '../supabaseClient';
import { fetchWordsByCategory } from '../api';
import { soundManager } from '../utils/SoundManager';
import { TIER_CONFIG } from '../constants/gameConfig';
import { getDynamicSpeed } from '../engine/speedController';

const basicChars = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅎ', 'ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'];

const WordRainGame = ({ settings, language, user, onGameOver }) => {
    const canvasRef = useRef(null);
    const inputRef = useRef(null);
    const [dbWords, setDbWords] = useState([]);
    const [score, setScore] = useState(0);
    const [hearts, setHearts] = useState(5);
    const [toast, setToast] = useState({ show: false, text: '' }); // Toast State
    const t = translations[language] || translations.ko;

    // Game Over & Result Modal State
    const [gameOverState, setGameOverState] = useState(null);
    const [isSaving, setIsSaving] = useState(false); // 저장 로딩 상태

    // 1. Data Loading
    useEffect(() => {
        const fetchWords = async () => {
            // 특수 카테고리 모드 (General이 아닌 경우 RPC 사용)
            if (settings.category && settings.category !== 'General') {
                const data = await fetchWordsByCategory(settings.category, language);
                // API에서 이미 규격화된 데이터를 반환하므로 그대로 사용
                // 단, 기존 로직과의 호환성을 위해 필드 매핑 보정
                const normalized = data.map(w => ({
                    hangeul: w.text,
                    meaning: w.translation,
                    customSpeed: w.speed // API에서 받은 속도
                }));
                setDbWords(normalized);
            }
            // 1단계(입문) - 자모음
            else if (settings.level === 1) {
                setDbWords(basicChars.map(char => ({ hangeul: char, meaning: char })));
            }
            // 기존 레벨 모드 (General)
            else {
                const { data, error } = await supabase
                    .from('k_vocabulary')
                    .select('hangeul, meaning, meaning_es, meaning_jp')
                    .eq('level', settings.level)
                    .limit(100);
                if (!error && data) setDbWords(data);
            }
        };
        fetchWords();
    }, [settings.level, settings.category, language]);

    // 2. Game Logic (Canvas)
    useEffect(() => {
        if (dbWords.length === 0 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const input = inputRef.current;

        // Set static size
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

        class HangeulRain {
            constructor() {
                this.words = [];
                this.score = 0;
                this.lives = 5;
                this.speedMultiplier = 0.5 + (settings.level * 0.3);
                this.isRunning = true;
                this.lastSpawn = 0;
                this.spawnRate = 2000 - (settings.level * 200);

                this.update = this.update.bind(this);
                this.checkMatch = this.checkMatch.bind(this);
            }



            spawnWord() {
                // 1. Calculate Tier based on Score
                const currentScore = this.score;
                const tierLevel = Object.keys(TIER_CONFIG).find(t =>
                    currentScore >= TIER_CONFIG[t].scoreRange[0] &&
                    currentScore <= TIER_CONFIG[t].scoreRange[1]
                ) || 6;



                const targetData = dbWords[Math.floor(Math.random() * dbWords.length)];

                // Determine text based on language
                let currentMeaning = targetData.meaning;
                if (!targetData.customSpeed) {
                    if (language === 'es' && targetData.meaning_es) currentMeaning = targetData.meaning_es;
                    if (language === 'jp' && targetData.meaning_jp) currentMeaning = targetData.meaning_jp;
                }

                const text = settings.mode === 'hangeul' ? targetData.hangeul : currentMeaning;
                const x = Math.random() * (canvas.width - 150) + 50;

                // 2. Speed Allocation Logic (Optimized)
                // If API provides customSpeed, use it with slight randomization.
                // Otherwise, use the getDynamicSpeed controller.
                let speed;
                if (targetData.customSpeed) {
                    speed = targetData.customSpeed * (1 + (settings.level * 0.1));
                } else {
                    speed = getDynamicSpeed(tierLevel);
                }

                this.words.push({
                    text: text,
                    meaning: settings.mode === 'hangeul' ? currentMeaning : targetData.hangeul,
                    x: x,
                    y: -30,
                    speed: speed,
                    width: ctx.measureText(text).width,
                    tier: tierLevel // Store tier for rendering logic (e.g. WordItem visual hints)
                });
            }

            checkMatch(typedText) {
                // Normalize: Remove all spaces from both target and input for flexible matching
                const cleanInput = typedText.replace(/\s+/g, '');

                const index = this.words.findIndex(w => {
                    const cleanTarget = w.text.replace(/\s+/g, '');
                    return cleanTarget === cleanInput;
                });

                if (index !== -1) {
                    const matched = this.words.splice(index, 1)[0];
                    this.score += 10;
                    setScore(this.score);

                    setToast({
                        show: true,
                        text: `${matched.text} : ${matched.meaning || 'Correct!'}`
                    });

                    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 1500);
                    soundManager.play('hit');
                    return true;
                }
                return false;
            }

            update() {
                if (!this.isRunning) return;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Spawn Logic
                const now = Date.now();
                if (now - this.lastSpawn > this.spawnRate) {
                    this.spawnWord();
                    this.lastSpawn = now;
                }

                // Draw & Move
                ctx.font = "bold 24px 'Noto Sans KR', sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                for (let i = this.words.length - 1; i >= 0; i--) {
                    let word = this.words[i];
                    word.y += word.speed;

                    // Bubble Effect
                    ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
                    ctx.beginPath();
                    ctx.arc(word.x, word.y, 40, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.strokeStyle = "rgba(96, 165, 250, 0.3)";
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // Text Rendering based on Tier
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = "rgba(0,0,0,0.5)";
                    ctx.fillStyle = "#ffffff";

                    if (word.tier === 2) {
                        // Tier 2: First char Bold, rest faded
                        const firstChar = word.text.charAt(0);
                        const rest = word.text.slice(1);

                        // Measure for centering logic (simplified approximation since exact multi-style centering is complex)
                        // Or just render blindly:
                        const totalWidth = ctx.measureText(word.text).width;
                        const startX = word.x - (totalWidth / 2); // Assuming textAlign was center

                        ctx.textAlign = "left"; // Temporarily switch checks
                        ctx.fillStyle = "#ffffff";
                        ctx.font = "900 24px 'Noto Sans KR', sans-serif"; // Extra Bold
                        ctx.fillText(firstChar, startX, word.y);

                        const firstWidth = ctx.measureText(firstChar).width;

                        ctx.fillStyle = "rgba(156, 163, 175, 0.6)"; // Gray-400 opacity
                        ctx.font = "bold 24px 'Noto Sans KR', sans-serif";
                        ctx.fillText(rest, startX + firstWidth, word.y);

                        ctx.textAlign = "center"; // Restore

                    } else if (word.tier === 4) {
                        // Tier 4: Adjective (Gray) + Noun (White) e.g. "매운 김치"
                        const parts = word.text.split(' ');

                        if (parts.length >= 2) {
                            const totalWidth = ctx.measureText(word.text).width;
                            const startX = word.x - (totalWidth / 2);

                            ctx.textAlign = "left";

                            // Adjective (Gray)
                            ctx.fillStyle = "rgba(156, 163, 175, 0.6)";
                            ctx.fillText(parts[0], startX, word.y);
                            const p1Width = ctx.measureText(parts[0]).width;

                            // Space
                            const spaceWidth = ctx.measureText(' ').width;

                            // Noun (White)
                            ctx.fillStyle = "#ffffff";
                            ctx.fillText(parts[1], startX + p1Width + spaceWidth, word.y);

                            ctx.textAlign = "center";
                        } else {
                            ctx.fillStyle = "#ffffff";
                            ctx.fillText(word.text, word.x, word.y);
                        }

                    } else if (word.tier === 5) {
                        // Tier 5: Purple Pulse
                        // Pulse effect using sin wave on alpha or lightness
                        const pulse = Math.abs(Math.sin(Date.now() / 200));
                        // Color: Purple-400 (#c084fc)
                        ctx.fillStyle = `rgba(192, 132, 252, ${0.7 + (pulse * 0.3)})`;
                        ctx.shadowColor = `rgba(168, 85, 247, ${0.5 + (pulse * 0.5)})`; // Purple glow
                        ctx.shadowBlur = 10 + (pulse * 5);

                        ctx.fillText(word.text, word.x, word.y);

                    } else if (word.tier === 6) {
                        // Tier 6: Master (Golden Chaos)
                        // Effect: Strong Yellow Glow + Slight Shake (Vibration)

                        // Vibration
                        const shakeX = (Math.random() - 0.5) * 4; // +/- 2px shake
                        const shakeY = (Math.random() - 0.5) * 4;

                        ctx.fillStyle = "#FACC15"; // Yellow-400
                        ctx.shadowColor = "rgba(250, 204, 21, 0.8)"; // Yellow Glow
                        ctx.shadowBlur = 20;

                        // Draw with shake offset
                        ctx.fillText(word.text, word.x + shakeX, word.y + shakeY);

                    } else {
                        // Default (Tier 1, 3, etc)
                        ctx.fillStyle = "#ffffff";
                        ctx.fillText(word.text, word.x, word.y);
                    }



                    ctx.shadowBlur = 0;
                    ctx.textAlign = "center"; // Ensure reset
                    ctx.font = "bold 24px 'Noto Sans KR', sans-serif"; // Ensure reset

                    // Floor Collision
                    if (word.y > canvas.height + 40) {
                        this.words.splice(i, 1);
                        this.lives--;
                        setHearts(this.lives);
                        soundManager.play('miss');

                        if (this.lives <= 0) {
                            this.gameOver();
                        }
                    }
                }

                this.animationId = requestAnimationFrame(this.update);
            }

            start() {
                this.update();
            }

            stop() {
                this.isRunning = false;
                cancelAnimationFrame(this.animationId);
            }

            async gameOver() {
                this.stop();
                setGameOverState({
                    score: this.score,
                    category: settings.category || 'General'
                });
            }
        }

        const game = new HangeulRain();
        game.start();

        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                // Auto-Trim: Remove all spaces for user convenience in higher levels
                const rawVal = input.value;
                const valToMatch = rawVal.trim();

                // Allow matching even if user ignored spaces (e.g. "김치 먹어" vs "김치먹어")
                // Pass both raw and space-removed versions to checkMatch handles this logic internally
                if (game.checkMatch(valToMatch)) {
                    input.value = '';
                }
            }
        };

        input.addEventListener('keydown', handleKeyDown);

        return () => {
            game.stop();
            input.removeEventListener('keydown', handleKeyDown);
        };
    }, [dbWords, settings, language, t, user, onGameOver]);

    // 게임 결과 저장 및 페이지 이동 로직
    const handleSaveAndExit = async () => {
        setIsSaving(true);
        const finalScore = gameOverState?.score || 0;
        const userLevel = settings.level;

        try {
            // 1. 랭킹 테이블에 기록 추가
            const { data: { user: currentUser } } = await supabase.auth.getUser();

            if (currentUser) {
                const userNickname = currentUser.user_metadata?.nickname || currentUser.email.split('@')[0];
                const countryCode = navigator.language.split('-')[1] || 'US';

                const { error } = await supabase
                    .from('hangeul_rankings')
                    .insert([
                        {
                            user_id: currentUser.id,
                            nickname: userNickname,
                            score: finalScore,
                            level: userLevel,
                            country_code: countryCode,
                            created_at: new Date().toISOString()
                        }
                    ]);

                if (error) throw error;
            }

            // 2. 부모 컴포넌트에 'account'로 이동 요청
            if (onGameOver) {
                onGameOver('account');
            }

        } catch (error) {
            console.error("Save failed:", error);
            alert("저장에 실패했습니다. 로비로 이동합니다.");
            if (onGameOver) onGameOver(true);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="relative w-full h-[750px] bg-black/60 backdrop-blur-3xl rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in duration-700">
            {/* HUD */}
            <div className="absolute top-12 left-12 right-12 flex justify-between items-end z-20 pointer-events-none">
                <div>
                    <p className="text-[10px] font-black text-red-500 tracking-[0.3em] mb-2 uppercase">VITALITY</p>
                    <div className="flex space-x-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-3 h-8 rounded-full transition-all ${i < hearts ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-white/5'}`} />
                        ))}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-purple-400 tracking-[0.3em] mb-1 uppercase">
                        {settings.category && settings.category !== 'General' ? settings.category : "CURRENT SCORE"}
                    </p>
                    <p className="text-6xl font-black text-white italic tracking-tighter">{score}<span className="text-sm text-gray-500 not-italic ml-2">/ 300</span></p>
                </div>
            </div>

            {/* Translation Effect Toast */}
            {toast.show && (
                <div className="absolute top-24 right-12 z-30 px-6 py-3 bg-yellow-400 text-black font-black rounded-xl shadow-lg animate-in fade-in slide-in-from-right-4 transition-all duration-300">
                    {toast.text}
                </div>
            )}

            {/* Result Modal (User Request Design) */}
            {gameOverState && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-500">
                    <div className="bg-gray-900 p-10 rounded-[3rem] border-2 border-purple-500 text-center shadow-[0_0_50px_rgba(168,85,247,0.5)] max-w-md w-full mx-6">
                        <h2 className="text-5xl font-black text-red-500 mb-4 tracking-tighter">GAME OVER</h2>
                        <p className="text-2xl mb-8 font-mono text-gray-300">Final Score: <span className="text-yellow-400 font-bold ml-2">{gameOverState.score}</span></p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleSaveAndExit}
                                disabled={isSaving}
                                className="w-full py-4 bg-purple-600 rounded-full font-bold text-lg hover:bg-purple-700 transition shadow-lg shadow-purple-500/30 flex items-center justify-center"
                            >
                                {isSaving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        기록 저장 중...
                                    </>
                                ) : "기록 저장 및 마이페이지 이동"}
                            </button>
                            <button
                                onClick={() => onGameOver(false)}
                                className="text-gray-400 hover:text-white transition py-2 text-sm font-medium tracking-wider"
                            >
                                다시 도전하기 (RETRY)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Canvas Layer */}
            <canvas ref={canvasRef} className="block w-full h-full" />

            {/* Input Layer */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-lg px-8">
                <input
                    ref={inputRef}
                    type="text"
                    autoFocus
                    className="w-full bg-white/5 border-2 border-white/10 focus:border-purple-500 py-4 px-6 rounded-full text-xl text-center font-bold tracking-widest outline-none transition-all shadow-2xl backdrop-blur-xl placeholder-gray-500 text-white"
                    placeholder={t.lobby?.placeholder || "TYPE TO CONQUER"}
                />
            </div>
        </div>
    );
};

export default WordRainGame;
