import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) alert(error.message);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 매직 링크 대신 패스워드 기반 로그인/가입 로직 실행
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // 계정이 없는 경우 즉시 회원가입 시도 (MVP 편의성)
            console.log("Login failed, attempting signup:", error.message);
            const { error: signUpError } = await supabase.auth.signUp({ email, password });
            if (signUpError) {
                alert(signUpError.message);
            } else {
                alert('Welcome! Account created successfully.');
            }
        } else {
            // 로그인 성공 시 로직
            // App.js의 onAuthStateChange가 감지하여 자동으로 상태를 업데이트합니다.
            // window.location.href = '/account'; // SPA 구조상 페이지 리로드 방지를 위해 주석 처리
        }
        setLoading(false);
    };

    const { isDark } = useTheme();

    return (
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
            <div className={`w-full max-w-md p-10 rounded-[2.5rem] border backdrop-blur-xl transition-all shadow-2xl
        ${isDark
                    ? 'bg-white/10 border-white/10 text-white shadow-purple-500/10'
                    : 'bg-white/70 border-black/5 text-slate-900 shadow-slate-200'}`}>

                <h2 className="text-center text-4xl font-black mb-8 tracking-tighter">
                    Join the <span className="text-purple-600">madang</span>
                </h2>

                {/* SNS 로그인 영역 */}
                <div className="space-y-3 mb-6">
                    <button
                        onClick={signInWithGoogle}
                        className={`w-full flex items-center justify-center py-3 rounded-full font-bold transition duration-300
                            ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                    >
                        <img src="https://www.google.com/favicon.ico" className="w-5 h-5 mr-2" alt="Google" />
                        CONTINUE WITH GOOGLE
                    </button>
                    <div className="flex justify-between gap-2">
                        {['Apple', 'Facebook', 'X', 'GitHub'].map(sns => (
                            <button key={sns} className={`flex-1 py-2 rounded-lg text-[10px] cursor-not-allowed opacity-50
                                ${isDark ? 'bg-gray-800 text-gray-500' : 'bg-slate-200 text-slate-500'}`}>
                                {sns}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative flex items-center py-4">
                    <div className={`flex-grow border-t ${isDark ? 'border-gray-800' : 'border-slate-200'}`}></div>
                    <span className={`flex-shrink mx-4 text-xs uppercase font-semibold ${isDark ? 'text-gray-600' : 'text-slate-400'}`}>OR</span>
                    <div className={`flex-grow border-t ${isDark ? 'border-gray-800' : 'border-slate-200'}`}></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="YOUR EMAIL"
                        className={`w-full px-6 py-4 rounded-full border transition-all outline-none
              ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-200 focus:border-purple-500 text-slate-900'}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="YOUR PASSWORD"
                        className={`w-full px-6 py-4 rounded-full border transition-all outline-none
              ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-200 focus:border-purple-500 text-slate-900'}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-purple-600 text-white rounded-full font-bold hover:brightness-110 active:scale-95 transition shadow-lg shadow-purple-500/30"
                    >
                        {loading ? 'PROCESSING...' : 'CONTINUE'}
                    </button>
                </form>
            </div>
        </div>
    );
}
