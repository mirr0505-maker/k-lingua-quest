import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { translations } from './locales/languages';
import WordRainLobby from './components/WordRainLobby';
import WordRainGame from './components/WordRainGame';
import Auth from './components/Auth';
import { supabase } from './supabaseClient';
import RankingBoard from './components/RankingBoard';
import LiveTicker from './components/LiveTicker';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentMenu, setCurrentMenu] = useState('home');
  const [language, setLanguage] = useState(localStorage.getItem('selectedLang') || 'ko');

  useEffect(() => {
    localStorage.setItem('selectedLang', language);
  }, [language]);
  const [gameState, setGameState] = useState('lobby'); // 'lobby' or 'playing'
  const [gameSettings, setGameSettings] = useState(null);
  const [unlockedLevel, setUnlockedLevel] = useState(1); // 해금된 최고 레벨
  const [showAuth, setShowAuth] = useState(false); // 인증 모달 상태
  const [user, setUser] = useState(null); // 로그인 유저 정보

  useEffect(() => {
    // 3.5초간 인트로 노출 후 메인으로 진입
    const timer = setTimeout(() => setShowIntro(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 1. 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 2. 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setShowAuth(false); // 로그인 성공 시 모달 닫기
    });

    return () => subscription.unsubscribe();
  }, []);

  const t = translations[language] || translations.ko;

  if (showIntro) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden relative">
        <img
          src="intro.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-60 animate-ken-burns"
        />
        <div className="relative z-10 text-center animate-in fade-in zoom-in duration-1000">
          <h1 className="text-6xl font-black tracking-widest text-white mb-6">
            {t.brand}
          </h1>
          <p className="text-2xl font-light tracking-[0.8rem] text-purple-400 italic">
            {t.introSub}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased overflow-x-hidden">
      <Navbar
        onMenuClick={setCurrentMenu}
        language={language}
        setLanguage={setLanguage}
        user={user}
        onAuthClick={() => setShowAuth(true)}
      />

      {/* 내비바 바로 아래 전광판 배치 */}
      <div className="fixed top-[100px] w-full z-40">
        <LiveTicker />
      </div>

      {/* 인증 모달 레이어 */}
      {showAuth && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute -top-12 -right-12 text-white/50 hover:text-white text-4xl"
            >
              ×
            </button>
            <Auth language={language} onSuccess={() => setShowAuth(false)} />
          </div>
        </div>
      )}

      <main className="pt-48 max-w-7xl mx-auto px-10 min-h-screen">
        {currentMenu === 'home' && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* 하이엔드 히어로 섹션 */}
            <div className="relative h-[420px] rounded-[3rem] overflow-hidden mb-16 border border-white/5 bg-[#0a0a0a] shadow-2xl">
              <div className="absolute inset-0 flex flex-col justify-center px-24 z-10">
                <h2 className="text-5xl font-black mb-6 tracking-tighter leading-[1.1]">
                  {t.heroTitle}<br />
                  <span className="text-purple-500">{t.heroSub}</span>
                </h2>
                <p className="text-base text-gray-400 font-light italic leading-relaxed max-w-2xl tracking-wide opacity-90">
                  {t.heroDesc}
                </p>
              </div>
              {/* 장식용 그라데이션 - 치우침 방지 시각적 무게중심 */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-900/10 to-transparent" />
            </div>

            {/* 3대 퀘스트 카드 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-32">
              {t.cards?.map((card, i) => (
                <div key={i} className="bg-[#0f0f0f] p-12 rounded-[2.5rem] border border-white/5 hover:border-purple-500/40 transition-all cursor-pointer group hover:-translate-y-2 shadow-lg">
                  <div className="w-12 h-0.5 bg-purple-600 mb-10 group-hover:w-20 transition-all duration-500" />
                  <h3 className="text-2xl font-bold mb-5 tracking-tight">{card.t}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light opacity-80">{card.d}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {currentMenu === 'auth' && (
          <div className="pt-10 flex justify-center">
            <Auth language={language} />
          </div>
        )}

        {currentMenu === 'rankings' && (
          <div className="pt-10 flex justify-center animate-in fade-in zoom-in duration-500">
            <div className="w-full max-w-4xl">
              <RankingBoard language={language} />
            </div>
          </div>
        )}

        {currentMenu === 'wordrain' && (
          <div className="animate-in fade-in zoom-in duration-500">
            {gameState === 'lobby' ? (
              <WordRainLobby
                language={language}
                unlockedLevel={unlockedLevel} // 해금 상태 전달
                user={user}
                onStart={(settings) => {
                  setGameSettings(settings);
                  setGameState('playing'); // 게임 시작 상태로 전환
                }}
              />
            ) : (
              <WordRainGame
                settings={gameSettings}
                language={language}
                user={user}
                onGameOver={(isSuccess) => {
                  if (isSuccess && gameSettings.level === unlockedLevel) {
                    setUnlockedLevel(prev => prev + 1); // 다음 단계 해금
                  }
                  setGameState('lobby'); // 게임 종료 시 로비로 복귀
                }}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;