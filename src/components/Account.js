import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Account({ userSession, onNavigate }) {
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

                // 3. 레벨별 캐릭터 매핑 (임시 로직: DB 데이터가 아직 없으므로 2레벨 가정)
                // 추후 DB의 'level' 필드와 연동 가능
                const userLevel = 2;
                if (userLevel === 1) setCharacter({ icon: '🐣', title: 'K-Baby' });
                else if (userLevel === 2) setCharacter({ icon: '👨🎓', title: 'K-Student' });
                else if (userLevel >= 3) setCharacter({ icon: '⚔️', title: 'K-Warrior' });
                else if (userLevel >= 10) setCharacter({ icon: '👑', title: 'K-King' });
            }
            setLoading(false);
        }
        loadData();
    }, [userSession]);

    if (loading) return <div className="text-white text-center mt-20 font-bold animate-pulse">데이터 로딩 중...</div>;

    return (
        <div className="min-h-screen w-full bg-black text-white p-6 md:p-8 animate-in fade-in zoom-in duration-500">

            {/* 프로필 헤더 (Step 3 Refresh) */}
            <div className="flex items-center gap-6 mb-12 bg-gray-900/50 backdrop-blur-md p-6 rounded-[2rem] border border-gray-800 shadow-2xl">
                <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-tr from-purple-800 to-indigo-900 rounded-full flex items-center justify-center text-5xl shadow-[0_0_20px_rgba(147,51,234,0.4)] border-2 border-purple-500/20">
                        {character.icon}
                    </div>
                    <span className="absolute -bottom-2 -right-2 bg-purple-600/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold border border-white/10 shadow-lg">
                        {character.title}
                    </span>
                </div>

                <div className="ml-2">
                    <p className="text-gray-500 text-xs font-medium mb-1 tracking-wider uppercase">Welcome back,</p>
                    <h1 className="text-2xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        {user?.email?.split('@')[0] || 'GUEST'}
                    </h1>
                    <div className="flex items-end gap-2 text-xs text-gray-400 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 w-fit">
                        <span className="text-base">{clientInfo.flag}</span>
                        <div className="flex flex-col leading-none gap-0.5">
                            <span className="font-bold text-gray-300">{clientInfo.lang}</span>
                            <span className="text-[9px] opacity-60">AUTO-DETECTED</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 최근 5회 점수 대시보드 */}
            <div className="bg-gray-900/40 p-8 rounded-[2rem] border border-gray-800 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                    <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                    Recent 5 Sessions
                </h3>

                {scores.length > 0 ? (
                    <div className="h-64 flex items-end justify-between gap-4 px-2">
                        {scores.map((s, i) => {
                            const heightPercent = Math.min((s.score / 500) * 100, 100);

                            return (
                                <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer">
                                    <span className="mb-3 text-xs font-bold text-white bg-purple-600 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        {s.score} pt
                                    </span>

                                    <div
                                        className="w-full max-w-[60px] bg-gradient-to-t from-gray-800 to-purple-500 rounded-t-xl transition-all duration-700 hover:to-purple-400 relative overflow-hidden"
                                        style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                                    >
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent"></div>
                                    </div>

                                    <span className="mt-3 text-[10px] text-gray-500 font-mono">
                                        {new Date(s.created_at).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-800 rounded-2xl">
                        <span className="text-4xl mb-4 opacity-50">🎲</span>
                        <p className="text-gray-400 text-center font-medium">플레이 기록이 없습니다.<br />마당으로 진격하십시오!</p>
                    </div>
                )}
            </div>

            {/* 내비게이션 진격 버튼 */}
            <div className="flex flex-col md:flex-row gap-4 mt-12 mb-20">
                <button
                    onClick={() => onNavigate && onNavigate('wordrain')}
                    className="flex-1 py-4 bg-purple-600 rounded-2xl font-black text-sm tracking-widest hover:bg-purple-500 shadow-lg shadow-purple-900/20 hover:-translate-y-1 transition-all duration-300"
                >
                    놀이마당 (GAME START)
                </button>
                <button className="flex-1 py-4 bg-gray-900 rounded-2xl font-black text-sm tracking-widest text-gray-500 border border-gray-800 cursor-not-allowed hover:bg-gray-800 transition-colors">
                    장터마당 (COMING SOON)
                </button>
            </div>
        </div>
    );
}
