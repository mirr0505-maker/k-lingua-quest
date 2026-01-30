import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { translations } from './locales/languages';
import WordRainLobby from './components/WordRainLobby';
import WordRainGame from './components/WordRainGame';
import Login from './components/Login';
import Account from './components/Account';
import { supabase } from './supabaseClient';
import RankingBoard from './components/RankingBoard';
import LiveTicker from './components/LiveTicker';
import GlassCard from './components/GlassCard';
import { useTheme } from './context/ThemeContext';

function App() {
  const { isDark } = useTheme();
  const [showIntro, setShowIntro] = useState(true);
  const [currentMenu, setCurrentMenu] = useState('home');
  const [language, setLanguage] = useState(localStorage.getItem('selectedLang') || 'ko');

  useEffect(() => {
    localStorage.setItem('selectedLang', language);
  }, [language]);
  const [gameState, setGameState] = useState('lobby'); // 'lobby' or 'playing'
  const [gameSettings, setGameSettings] = useState(null);
  const [unlockedLevel] = useState(1); // 해금된 최고 레벨
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
    <div className={`min-h-screen font-sans antialiased overflow-x-hidden transition-colors duration-500 ${isDark ? 'bg-[#050505] text-white' : 'bg-gray-50 text-gray-900'}`}>
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
            <Login />
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
                <GlassCard key={i} isDark={isDark}>
                  <div className="w-12 h-0.5 bg-purple-600 mb-10 transition-all duration-500" />
                  <h3 className="text-2xl font-bold mb-5 tracking-tight">{card.t}</h3>
                  <p className="opacity-80 text-sm leading-relaxed font-light">{card.d}</p>
                </GlassCard>
              ))}
            </div>
          </section>
        )}

        {currentMenu === 'auth' && (
          <div className="pt-10 flex justify-center">
            <Login />
          </div>
        )}

        {currentMenu === 'account' && (
          <div className="pt-10 flex justify-center w-full">
            <Account userSession={user} onNavigate={setCurrentMenu} />
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
                  const nickname = user?.email?.split('@')[0] || localStorage.getItem('user_nickname') || 'Guest';
                  console.log(`${nickname}의 퀘스트 시작: [${settings.category || 'General'}]`);
                  setGameSettings(settings);
                  setGameState('playing'); // 게임 시작 상태로 전환
                }}
              />
            ) : (
              <WordRainGame
                settings={gameSettings}
                language={language}
                user={user}
                onGameOver={(result) => {
                  if (result === 'account') {
                    setGameState('lobby');
                    setCurrentMenu('account'); // 마이페이지로 이동
                    return;
                  }

                  // 기존 로직: true(로비), false(재시작)
                  if (result === true) { // Lobby
                    setGameState('lobby');
                  } else if (result === false) { // Retry (Stay or reset)
                    // 재시작 로직은 Game 컴포넌트 내부에서 처리되거나, 여기서 키를 바꿔 리마운트 필요
                    // 현재 구조상 Game 내부에서 resetGame을 호출하는게 이상적.
                    // 그러나 상위에서 제어한다면, Game 컴포넌트 key를 갱신해주는 방법이 있음.
                    // 편의상 로비로 보냈다가 다시 시작하게 하거나, 단순히 state 변경

                    // 여기서는 로비로 가는게 안전함 (WordRainGame이 내부 상태 리셋을 완벽히 지원해야 함)
                    // 위 코드에서는 onGameOver(false) -> RETRY라고 주석되어 있으나 실제 구현은 상위 의존.
                    // 만약 즉시 재시작을 원한다면 Game에 key prop을 주어 강제 리마운트가 좋음.
                    setGameState('lobby'); // 임시: 로비 복귀
                  }

                  if (result === true && gameSettings.level === unlockedLevel) {
                    // 로비로 나갈 때 클리어 여부 판단? (원래 로직에선 isSuccess 인자가 넘어옴)
                    // 구조상 isSuccess를 정확히 넘기기 어려워졌으므로 조정 필요
                    // 하지만 'account'로 나가는 경우는 클리어로 간주하지 않음.
                  }
                }}
              />
            )}
          </div>
        )}

        {['match', 'quiz', 'market'].map((menu) => (
          currentMenu === menu && (
            <div key={menu} className="pt-20 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 min-h-[50vh]">
              <div className="text-6xl mb-6">🚧</div>
              <h2 className="text-4xl font-black text-white mb-2 uppercase">{menu}</h2>
              <p className="text-gray-500 font-mono">Coming Soon...</p>
            </div>
          )
        ))}
      </main>
    </div>
  );
}

export default App;