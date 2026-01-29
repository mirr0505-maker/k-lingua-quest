import { useState } from 'react';
import { supabase } from '../supabaseClient';

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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
            <div className="w-full max-w-md space-y-8 bg-gray-900/50 p-10 rounded-3xl border border-gray-800 backdrop-blur-md shadow-2xl">

                {/* 문구 변경: Join the Hangul madang */}
                <h2 className="text-center text-4xl font-extrabold tracking-tight mb-4">
                    Join the <span className="text-purple-500 text-shadow-glow">Hangul madang</span>
                </h2>

                {/* SNS 로그인 영역: 구글만 활성, 나머지는 UI용 */}
                <div className="space-y-3">
                    <button
                        onClick={signInWithGoogle}
                        className="w-full flex items-center justify-center bg-white text-black py-3 rounded-full font-bold hover:bg-gray-200 transition duration-300"
                    >
                        <img src="https://www.google.com/favicon.ico" className="w-5 h-5 mr-2" alt="Google" />
                        CONTINUE WITH GOOGLE
                    </button>
                    <div className="flex justify-between gap-2">
                        {['Apple', 'Facebook', 'X', 'GitHub'].map(sns => (
                            <button key={sns} className="flex-1 py-2 bg-gray-800 rounded-lg text-[10px] text-gray-500 cursor-not-allowed opacity-50">
                                {sns}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative flex items-center py-4">
                    <div className="flex-grow border-t border-gray-800"></div>
                    <span className="flex-shrink mx-4 text-gray-600 text-xs uppercase font-semibold">OR</span>
                    <div className="flex-grow border-t border-gray-800"></div>
                </div>

                {/* 이메일 + 패스워드 입력창 구성 */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="YOUR EMAIL ADDRESS"
                        className="w-full px-5 py-4 bg-gray-800/80 border border-gray-700 rounded-full focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-300 text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="YOUR PASSWORD"
                        className="w-full px-5 py-4 bg-gray-800/80 border border-gray-700 rounded-full focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-300 text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-purple-600 rounded-full font-bold text-lg hover:bg-purple-700 shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95 transition duration-300"
                    >
                        {loading ? 'PROCESSING...' : 'LOGIN / SIGN UP'}
                    </button>
                </form>
            </div>
        </div>
    );
}
