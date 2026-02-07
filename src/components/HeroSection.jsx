import React from 'react';
import { translations } from '../constants/languages';

export default function HeroSection({ lang }) {
    const t = translations[lang] || translations.ko;

    return (
        <section className="pt-32 pb-20 px-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="max-w-4xl">
                <h1 className="text-6xl font-black text-white mb-4">
                    {t.hero.title}
                </h1>
                <h2 className="text-5xl font-bold text-purple-500 mb-8 italic">
                    {t.hero.subtitle}
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                    {t.hero.desc}
                </p>
            </div>
        </section>
    );
}
