import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [language, setLanguage] = useState('en');

  const i18n = {
    en: { subtitle: "GLOBAL HANGEUL MASTERY PLATFORM", start: "QUEST START", loading: "Loading..." },
    es: { subtitle: "PLATAFORMA GLOBAL DE MAESTRÍA EN HANGEUL", start: "INICIAR QUEST", loading: "Cargando..." },
    jp: { subtitle: "グローバル・ハングル・マスタリー・プラットフォーム", start: "クエスト開始", loading: "読み込み中..." }
  };

  const fetchWord = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('k_vocabulary').select('*').limit(1);
    if (data) setWord(data[0]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white p-8">
      <div className="flex justify-between items-center mb-16">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full border-2 border-purple-500 flex items-center justify-center bg-black text-xl font-bold">흑</div>
          <div>
            <p className="text-xs text-purple-400">MASTER TIER</p>
            <h2 className="text-xl font-bold">흑무영 Heukmuyeong</h2>
          </div>
        </div>

        <div className="flex space-x-2 bg-black/40 p-1 rounded-lg border border-white/10">
          {['en', 'es', 'jp'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 rounded-md text-sm transition-all ${language === lang ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center mt-20">
        <h1 className="text-7xl font-black italic tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-500">
          K-LINGUA QUEST
        </h1>
        <p className="text-gray-400 tracking-[0.3em] font-light mb-12">
          {i18n[language].subtitle}
        </p>

        {word ? (
          <div className="bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10 mb-8">
            <h2 className="text-8xl font-bold mb-4">{word.word}</h2>
            <p className="text-2xl text-purple-300 italic">{word[`meaning_${language}`] || word.meaning}</p>
          </div>
        ) : (
          <button
            onClick={fetchWord}
            className="group relative inline-flex items-center justify-center px-12 py-6 font-bold text-black transition-all duration-200 bg-white rounded-full hover:bg-purple-500 hover:text-white"
          >
            {loading ? i18n[language].loading : i18n[language].start}
            <span className="ml-3 text-2xl">▶</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default App;