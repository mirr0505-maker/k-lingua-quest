import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { translations } from './locales/languages';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentMenu, setCurrentMenu] = useState('home');
  const [language, setLanguage] = useState('ko');

  useEffect(() => {
    // 3.5초간 인트로 노출 후 메인으로 진입
    const timer = setTimeout(() => setShowIntro(false), 3500);
    return () => clearTimeout(timer);
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
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased">
      <Navbar onMenuClick={setCurrentMenu} language={language} setLanguage={setLanguage} />

      <main className="pt-36 max-w-6xl mx-auto px-10">
        {currentMenu === 'home' && (
          <section className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {/* 하이엔드 미니멀 히어로 섹션 */}
            <div className="relative h-[380px] rounded-[2.5rem] overflow-hidden mb-16 border border-white/5 bg-[#0a0a0a]">
              <div className="absolute inset-0 flex flex-col justify-center px-20 z-10">
                <h2 className="text-4xl font-black mb-5 tracking-tighter leading-tight">
                  {t.heroTitle}<br />
                  <span className="text-purple-500">{t.heroSub}</span>
                </h2>
                <p className="text-sm text-gray-400 font-light italic leading-relaxed max-w-xl tracking-wide opacity-80">
                  {t.heroDesc}
                </p>
              </div>
            </div>

            {/* 순우리말 퀘스트 카드 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-32">
              {t.cards.map((card, i) => (
                <div key={i} className="bg-[#0f0f0f] p-10 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group hover:-translate-y-1">
                  <div className="w-10 h-0.5 bg-purple-600 mb-8 group-hover:w-16 transition-all" />
                  <h3 className="text-2xl font-bold mb-4">{card.t}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light">{card.d}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;