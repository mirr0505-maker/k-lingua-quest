import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Auth = ({ language }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    // 1. 메일 승인 방식 (Magic Link)
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) alert(error.message);
        else alert('승인 메일이 발송되었습니다. 메일함의 링크를 클릭하십시오!');
        setLoading(false);
    };

    // 2. SNS 연동 방식 (Google)
    const handleSNSLogin = async (provider) => {
        const { error } = await supabase.auth.signInWithOAuth({ provider });
        if (error) alert(error.message);
    };

    return (
        <div className="max-w-md mx-auto bg-black/60 backdrop-blur-3xl p-12 rounded-[3rem] border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-black mb-8 tracking-tighter text-center">JOIN THE <span className="text-purple-500">WAR</span></h2>

            {/* SNS 연동 영역 */}
            <div className="space-y-4 mb-10">
                <button onClick={() => handleSNSLogin('google')} className="w-full py-4 bg-white text-black rounded-full font-black text-xs tracking-widest flex items-center justify-center hover:bg-gray-200 transition-all">
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-3" alt="" />
                    CONTINUE WITH GOOGLE
                </button>
                <button onClick={() => handleSNSLogin('github')} className="w-full py-4 bg-[#24292e] text-white rounded-full font-black text-xs tracking-widest flex items-center justify-center hover:bg-black transition-all">
                    CONTINUE WITH GITHUB
                </button>
            </div>

            <div className="flex items-center my-8 opacity-20"><hr className="flex-grow border-white" /> <span className="px-4 text-[10px]">OR</span> <hr className="flex-grow border-white" /></div>

            {/* 메일 승인 영역 */}
            <form onSubmit={handleLogin} className="space-y-6">
                <input
                    type="email" placeholder="YOUR EMAIL ADDRESS"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 py-4 px-6 rounded-full text-center text-xs font-bold outline-none focus:border-purple-500 transition-all placeholder-gray-500"
                />
                <button disabled={loading} className="w-full py-4 bg-purple-600 rounded-full font-black text-xs tracking-widest hover:bg-purple-500 shadow-lg shadow-purple-500/20 transition-all">
                    {loading ? 'SENDING...' : 'SEND MAGIC LINK'}
                </button>
            </form>
        </div>
    );
};

export default Auth;
