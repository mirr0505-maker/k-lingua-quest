import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useTheme } from '../context/ThemeContext';

export default function Account({ userSession, onNavigate }) {
    const { isDark } = useTheme();
    const [user, setUser] = useState(userSession);
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    // Step 3: Local & Character State
    const [clientInfo, setClientInfo] = useState({ lang: 'Loading...', flag: '' });
    const [character, setCharacter] = useState({ icon: '🐣', title: 'K-Baby' });

    // 언어 및 국가 자동 감지 로직
    const getClientLocale = () => {
        const locale = navigator.language || 'en-US';
        const countryCode = locale.split('-')[1] || 'US';

        // 국가별 디폴트 언어 매핑
        const langMap = {
            'KR': { lang: 'Korean', flag: '🇰🇷' },
            'US': { lang: 'English', flag: '🇺🇸' },
            'JP': { lang: 'Japanese', flag: '🇯🇵' },
            'FR': { lang: 'French', flag: '🇫🇷' },
            'CN': { lang: 'Chinese', flag: '🇨🇳' },
            'DE': { lang: 'German', flag: '🇩🇪' }
        };

        return langMap[countryCode] || langMap['US'];
    };

    useEffect(() => {
        async function loadData() {
            let currentUser = userSession;

            if (!currentUser) {
                const { data: { user } } = await supabase.auth.getUser();
                currentUser = user;
                setUser(user);
            }

            // Step 3: 접속 정보 설정
            const locale = getClientLocale();
            setClientInfo(locale);

            if (currentUser) {
                // 2. 최근 5회 점수 로드
                const { data, error } = await supabase
                    .from('hangeul_rankings')
                    .select('score, created_at')
                    .eq('user_id', currentUser.id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (error) {
                    console.error(error);
                } else {
                    setScores(data ? data.reverse() : []);
                }

                // 3. 레벨별 캐릭터 매핑
                const userLevel = 2; // TODO: DB 연동
                if (userLevel === 1) setCharacter({ icon: '🐣', title: 'K-Baby' });
                else if (userLevel === 2) setCharacter({ icon: '👨🎓', title: 'K-Student' });
                else if (userLevel >= 3) setCharacter({ icon: '⚔️', title: 'K-Warrior' });
                else if (userLevel >= 10) setCharacter({ icon: '👑', title: 'K-King' });
            }
            setLoading(false);
        }
        loadData();
    }, [userSession]);

    if (loading) return <div className="text-gray-500 text-center mt-20 font-bold animate-pulse">데이터 로딩 중...</div>;

    return (
        <div className={`min-h-screen w-full p-6 md:p-8 animate-in fade-in zoom-in duration-500 transition-colors
            ${isDark ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>

            {/* 프로필 헤더 */}
            <div className={`flex items-center gap-6 mb-12 p-6 rounded-[2rem] border transition-all duration-300
                ${isDark
                    ? 'bg-gray-900/50 backdrop-blur-md border-gray-800 shadow-2xl'
                    : 'bg-white border-slate-200 shadow-xl'}`}>

                <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-5xl shadow-[0_0_20px_rgba(147,51,234,0.4)] border-4 border-white/10">
                        {character.icon}
                    </div>
                    <span className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-lg text-[10px] font-bold border shadow-lg
                        ${isDark
                            ? 'bg-gray-800 border-white/10 text-white'
                            : 'bg-white border-slate-100 text-slate-900'}`}>
                        {character.title}
                    </span>
                </div>

                <div className="ml-2">
                    <p className={`text-xs font-bold mb-1 tracking-wider uppercase ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                        Welcome back,
                    </p>
                    <h1 className={`text-3xl font-black tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {user?.email?.split('@')[0] || 'GUEST'}
                    </h1>
                    <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border w-fit
                        ${isDark
                            ? 'bg-black/40 border-white/5 text-gray-400'
                            : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                        <span className="text-base">{clientInfo.flag}</span>
                        <div className="flex flex-col leading-none gap-0.5">
                            <span className={`font-bold ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                {clientInfo.lang}
                            </span>
                            <span className="text-[9px] opacity-60">AUTO-DETECTED</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 최근 5회 점수 대시보드 (Chart) */}
            <div className={`p-8 rounded-[2rem] border transition-all duration-300
                ${isDark
                    ? 'bg-gray-900/40 border-gray-800 backdrop-blur-sm'
                    : 'bg-white border-slate-200 shadow-sm'}`}>

                <h3 className={`text-lg font-bold mb-8 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                    Recent 5 Sessions
                </h3>

                {scores.length > 0 ? (
                    <div className="h-48 flex items-end justify-between gap-4 px-2">
                        {scores.map((s, i) => {
                            // Scale score to max 3000 (roughly lv 6 max)
                            const heightPercent = Math.min((s.score / 3000) * 100, 100);

                            return (
                                <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer">
                                    <span className={`mb-3 text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0
                                        ${isDark ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}>
                                        {s.score}
                                    </span>

                                    <div
                                        className={`w-full max-w-[50px] rounded-t-xl transition-all duration-700 relative overflow-hidden
                                            ${isDark ? 'bg-gray-800' : 'bg-slate-100'}`}
                                        style={{ height: `${heightPercent}%`, minHeight: '8px' }}
                                    >
                                        <div className={`absolute bottom-0 w-full transition-all duration-1000
                                             ${isDark ? 'bg-purple-600' : 'bg-purple-500'}`}
                                            style={{ height: '100%' }}
                                        />
                                    </div>

                                    <span className={`mt-3 text-[10px] font-mono tracking-tighter
                                        ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                                        {new Date(s.created_at).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={`flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-2xl
                        ${isDark ? 'border-gray-800 text-gray-500' : 'border-slate-200 text-slate-400'}`}>
                        <span className="text-4xl mb-4 opacity-50">🎲</span>
                        <p className="font-medium text-center">No records found.<br />Start your journey!</p>
                    </div>
                )}
            </div>

            {/* 내비게이션 진격 버튼 */}
            <div className="flex flex-col md:flex-row gap-4 mt-8 mb-20">
                <button
                    onClick={() => onNavigate && onNavigate('wordrain')}
                    className="flex-1 py-5 rounded-2xl font-black text-sm tracking-widest bg-purple-600 text-white hover:bg-purple-500 shadow-xl shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300"
                >
                    PLAY WORD RAIN
                </button>
                <button className={`flex-1 py-5 rounded-2xl font-black text-sm tracking-widest border transition-colors cursor-not-allowed
                    ${isDark
                        ? 'bg-gray-900 text-gray-600 border-gray-800'
                        : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                    MARKET (COMING SOON)
                </button>
            </div>
        </div>
    );
}
