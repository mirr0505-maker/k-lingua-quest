
import React, { useState, useEffect, useRef } from 'react';
import { translations } from '../locales/languages';
import { supabase } from '../supabaseClient';

const basicChars = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅎ', 'ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'];

const WordRainGame = ({ settings, language, user, onGameOver }) => {
    const [dbWords, setDbWords] = useState([]); // DB에서 가져온 단어 풀
    const [words, setWords] = useState([]);
    const [input, setInput] = useState('');
    const [score, setScore] = useState(0);
    const [hearts, setHearts] = useState(5);
    const t = translations[language] || translations.ko;
    const lastEnterRef = useRef(0);

    // 1-1. 실데이터 로딩: 레벨에 맞는 단어들을 DB에서 호출
    useEffect(() => {
        const fetchWords = async () => {
            // 1단계(입문)는 자모음 배열 사용, 2단계부터는 DB 호출
            if (settings.level === 1) {
                setDbWords(basicChars.map(char => ({ hangeul: char, meaning: char })));
            } else {
                const { data, error } = await supabase
                    .from('k_vocabulary')
                    .select('hangeul, meaning')
                    .eq('level', settings.level) // 흑무영님의 2~6단계 레벨링 매칭
                    .limit(100);

                if (!error && data) setDbWords(data);
            }
        };
        fetchWords();
    }, [settings.level]);

    // 1-2. 단어 생성 및 중력 로직
    useEffect(() => {
        if (dbWords.length === 0) return;

        const spawnInterval = setInterval(() => {
            const targetData = dbWords[Math.floor(Math.random() * dbWords.length)];
            const newWord = {
                id: Date.now(),
                // 모드에 따라 텍스트 결정: '한글 타이핑' 혹은 '뜻 타이핑'
                text: settings.mode === 'hangeul' ? targetData.hangeul : targetData.meaning,
                subText: settings.mode === 'hangeul' ? targetData.meaning : targetData.hangeul,
                x: Math.random() * 80 + 10,
                y: -50, // 시작점 조정
                speed: 0.8 + (settings.level * 0.4),
            };
            setWords(prev => [...prev, newWord]);
        }, 2000 - (settings.level * 200));

        const gravity = setInterval(() => {
            setWords(prev => {
                const nextWords = prev.map(w => ({ ...w, y: w.y + w.speed }));
                if (nextWords.some(w => w.y > 580)) {
                    setHearts(h => h - 1);
                    return nextWords.filter(w => w.y <= 580);
                }
                return nextWords;
            });
        }, 50);

        return () => { clearInterval(spawnInterval); clearInterval(gravity); };
    }, [dbWords, settings.level, settings.mode]);

    // 300점 달성 여부 추적
    const [achieved300, setAchieved300] = useState(false);

    // 게임 오버 및 기록 저장 로직
    useEffect(() => {
        const saveRanking = async (finalScore, isSuccess) => {
            const insertData = {
                nickname: user ? user.email.split('@')[0] : "Guest_Warrior",
                score: finalScore,
                level: settings.level,
                country_code: language === 'ko' ? 'KR' : language === 'en' ? 'US' : language === 'jp' ? 'JP' : 'ES'
            };

            // 로그인 유저일 경우 user_id 추가
            if (user) {
                insertData.user_id = user.id;
            }

            // 비로그인 유저도 랭킹에 등록하되, user_id는 제외 (테이블 허용 시)
            // 만약 테이블이 user_id를 필수로 요구하지 않는다면 게스트도 저장 가능

            const { error } = await supabase.from('hangeul_rankings').insert([insertData]);

            if (error) console.error('Ranking save failed:', error);
            else console.log("기록이 성공적으로 전장에 등록됨!");

            onGameOver(isSuccess);
        };

        if (hearts <= 0) {
            alert("전투 불능! 재정비 후 다시 진격하십시오.");
            saveRanking(score, false);
        }

        // 300점 돌파 시 (한 번만 실행)
        if (score >= 300 && !achieved300) {
            console.log("300점 돌파! 다음 단계 자격 획득.");
            setAchieved300(true);
            // 추후 화면에 멋진 이펙트 추가 가능
        }

        // 500점 최종 돌파 시
        if (score >= 500) {
            alert("🎖️ 전설의 탄생! 500점 고지를 정복했습니다.");
            saveRanking(score, true);
        }
    }, [hearts, score, settings.level, language, onGameOver, achieved300, user]);

    // 3. 정복 판정 (엔터 입력 시)
    const handleInput = (e) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const now = Date.now();
            const val = input.trim();
            const target = words.find(w => w.text === val);

            if (target) {
                setScore(s => s + 10);
                setWords(prev => prev.filter(w => w.id !== target.id));
                setInput('');
            } else {
                // 더블 엔터 시 리셋 (300ms 타임프레임)
                if (now - lastEnterRef.current < 300) {
                    setInput('');
                }
            }
            lastEnterRef.current = now;
        }
    };

    return (
        <div className="relative w-full h-[750px] bg-black/60 backdrop-blur-3xl rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in duration-700">
            {/* 상태바 */}
            <div className="absolute top-12 left-12 right-12 flex justify-between items-end z-20">
                <div>
                    <p className="text-[10px] font-black text-red-500 tracking-[0.3em] mb-2 uppercase">VITALITY</p>
                    <div className="flex space-x-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-3 h-8 rounded-full transition-all ${i < hearts ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-white/5'}`} />
                        ))}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-purple-400 tracking-[0.3em] mb-1 uppercase">CURRENT SCORE</p>
                    <p className="text-6xl font-black text-white italic tracking-tighter">{score}<span className="text-sm text-gray-500 not-italic ml-2">/ 300</span></p>
                </div>
            </div>

            {/* 게임 필드 (물방울 비) */}
            <div className="relative h-[550px] mt-24">
                {words.map(word => (
                    <div key={word.id} className="absolute flex flex-col items-center" style={{ left: `${word.x}%`, top: `${word.y}px` }}>
                        <div className="w-20 h-20 rounded-full bg-blue-500/10 border-2 border-blue-400/30 backdrop-blur-md flex items-center justify-center shadow-[0_10px_30px_rgba(59,130,246,0.2)] animate-pulse">
                            <span className="text-2xl font-black text-white">{word.text}</span>
                        </div>
                        <div className="w-1 h-12 bg-gradient-to-b from-blue-400/40 to-transparent" />
                    </div>
                ))}
            </div>

            {/* 입력창 */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-lg px-8">
                <input
                    type="text" value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    autoFocus className="w-full bg-white/5 border-2 border-white/10 focus:border-purple-500 py-4 px-6 rounded-full text-xl text-center font-bold tracking-widest outline-none transition-all shadow-2xl backdrop-blur-xl placeholder-gray-500"
                    placeholder={t.lobby?.placeholder || "TYPE TO CONQUER"}
                />
            </div>
        </div>
    );
};

export default WordRainGame;
