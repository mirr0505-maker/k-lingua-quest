import React, { useState, useEffect, useRef } from 'react';
import { translations } from '../locales/languages';
import { supabase } from '../supabaseClient';
import { fetchWordsByCategory } from '../api';
import { soundManager } from '../utils/SoundManager';

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
                const targetData = dbWords[Math.floor(Math.random() * dbWords.length)];

                // Determine text based on language
                let currentMeaning = targetData.meaning;
                if (!targetData.customSpeed) { // 일반 모드일 때만 언어별 핸들링 (API 모드는 이미 결정됨)
                    if (language === 'es' && targetData.meaning_es) currentMeaning = targetData.meaning_es;
                    if (language === 'jp' && targetData.meaning_jp) currentMeaning = targetData.meaning_jp;
                }

                const text = settings.mode === 'hangeul' ? targetData.hangeul : currentMeaning;
                const x = Math.random() * (canvas.width - 150) + 50;

                // 속도 결정: API에서 받은 속도(customSpeed)가 있으면 사용, 아니면 레벨 기반 계산
                const speed = targetData.customSpeed
                    ? targetData.customSpeed * (1 + (settings.level * 0.1)) // 레벨 가중치 약간 부여
                    : (Math.random() * 1 + 0.5) * this.speedMultiplier;

                this.words.push({
                    text: text,
                    meaning: settings.mode === 'hangeul' ? currentMeaning : targetData.hangeul, // 정답 확인 시 보여줄 반대 텍스트
                    x: x,
                    y: -30,
                    speed: speed,
                    width: ctx.measureText(text).width
                });
            }

            checkMatch(typedText) {
                const index = this.words.findIndex(w => w.text === typedText);
                if (index !== -1) {
                    const matched = this.words.splice(index, 1)[0];
                    this.score += 10;
                    setScore(this.score);

                    // 정답 시 번역 이펙트 노출
                    // matched.text(한글) vs matched.meaning(뜻)
                    // 현재 settings.mode에 따라 text가 달라지므로 원본 데이터 찾기가 필요할 수 있음
                    // 하지만 간단히 현재 text와 반대되는 개념을 보여주거나, DB에서 가져온 원본을 참조해야 함.
                    // 편의상 여기선 'meaning' 값을 보여주는 것으로 타협하거나,
                    // spawnWord에서 메타데이터를 더 넣도록 수정.

                    // (수정 제안: spawnWord에서 meaning 필드 추가)
                    setToast({
                        show: true,
                        text: `${matched.text} : ${matched.meaning || 'Correct!'}`
                    });

                    // 1.5초 후 토스트 숨김 (React State 제어는 루프 밖에서 처리되므로 setTimeout 사용)
                    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 1500);

                    // 사운드 재생
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

                    // Text
                    ctx.fillStyle = "#ffffff";
                    ctx.shadowColor = "rgba(0,0,0,0.5)";
                    ctx.shadowBlur = 4;
                    ctx.fillText(word.text, word.x, word.y);
                    ctx.shadowBlur = 0;

                    // Floor Collision
                    if (word.y > canvas.height + 40) {
                        this.words.splice(i, 1);
                        this.lives--;
                        setHearts(this.lives);
                        soundManager.play('miss'); // 실패 사운드

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

                // 1. 랭킹 테이블에 기록 추가
                const insertData = {
                    nickname: user ? user.email.split('@')[0] : "Guest_Warrior",
                    score: this.score,
                    level: settings.level,
                    category: settings.category || 'General',
                    country_code: language === 'ko' ? 'KR' : language === 'en' ? 'US' : language === 'jp' ? 'JP' : 'ES'
                };
                if (user) insertData.user_id = user.id;

                const { error: rankError } = await supabase.from('hangeul_rankings').insert([insertData]);

                // 2. 프로필 누적 점수 업데이트 (로그인 유저만)
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('total_score')
                        .eq('id', user.id)
                        .single();

                    const newTotal = (profile?.total_score || 0) + this.score;

                    await supabase
                        .from('profiles')
                        .update({ total_score: newTotal })
                        .eq('id', user.id);
                }

                if (!rankError) {
                    console.log("전과 보고 완료. 점수가 기록되었습니다.");
                }

                // 모달 팝업 상태 설정 (화면 전환 X)
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
                const val = input.value.trim();
                if (game.checkMatch(val)) {
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

            {/* Result Modal */}
            {gameOverState && (
                <div className="result-modal-overlay">
                    <div className="result-content-box">
                        <div className="result-scanline" />
                        <h2 className="text-5xl font-black text-green-500 mb-8 tracking-tighter">MISSION COMPLETE</h2>
                        <div className="space-y-4 mb-10 text-xl font-mono">
                            <p className="flex justify-between w-64 mx-auto border-b border-white/10 pb-2">
                                <span className="text-gray-400">SCORE</span>
                                <span className="font-bold text-white">{gameOverState.score}</span>
                            </p>
                            <p className="flex justify-between w-64 mx-auto border-b border-white/10 pb-2">
                                <span className="text-gray-400">CATEGORY</span>
                                <span className="font-bold text-blue-400">{gameOverState.category}</span>
                            </p>
                        </div>
                        <div className="flex space-x-4 justify-center">
                            <button
                                onClick={() => onGameOver(false)} // 게임 재시작 또는 로비
                                className="px-8 py-3 bg-green-600 hover:bg-green-500 text-black font-black rounded-full pointer-events-auto"
                            >
                                RETRY
                            </button>
                            <button
                                onClick={() => onGameOver(true)} // 로비로 이동
                                className="px-8 py-3 border border-white/20 hover:bg-white/10 font-bold rounded-full pointer-events-auto"
                            >
                                LOBBY
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
