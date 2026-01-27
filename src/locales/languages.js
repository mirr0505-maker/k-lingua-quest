// src/locales/languages.js
export const translations = {
    ko: {
        brand: "한글 놀이마당",
        introSub: "신나게 놀아보자",
        navbar: ['한글 비', '짝 맞추기', '글 풀이', '사랑방', '제안하기'],
        langDisplay: "🇰🇷 KO",
        accountLabel: "계정",
        auth: { login: "로그인", signup: "회원가입" },
        heroTitle: "한글 놀이마당",
        heroSub: "K-Culture를 즐기다",
        heroDesc: "K-Pop, K-Drama, K-Food, K-Culture의 정수를 통해 한글의 본질을 꿰뚫으십시오.",
        cards: [
            { t: '한글 비', d: '하늘에서 비처럼 쏟아지는 단어를 정복하십시오.' },
            { t: '짝 맞추기', d: '흩어진 글자와 의미를 하나로 이어주십시오.' },
            { t: '글 풀이', d: '세련된 문장과 퀴즈를 통해 실력을 증명하십시오.' }
        ],
        lobby: {
            title: "한글 비",
            subTitle: "QUEST LOBBY",
            desc: "단계별 정복을 통해 한글의 대가가 되십시오.",

            placeholder: "단어를 입력하고 엔터",
            modeHangeul: "한글 타이핑 모드",
            modeMeaning: "뜻 타이핑 모드",
            startBtn: "진격 START",
            levels: [
                { id: 1, name: '입문 (Beginner)', desc: '한글 자음/모음', locked: false },
                { id: 2, name: '초보 (Novice)', desc: 'K-Culture 한 단어', locked: true },
                { id: 3, name: '중수 (Intermediate)', desc: 'K-Culture 기초 단어', locked: true },
                { id: 4, name: '숙련 (Skilled)', desc: 'K-Culture 일상 용어', locked: true },
                { id: 5, name: '전문 (Expert)', desc: 'K-Culture 대사, 가사', locked: true },
                { id: 6, name: '대가 (Master)', desc: '원어민 수준 완성', locked: true }
            ]
        }
    },
    en: {
        brand: "Hangeul Play Yard",
        introSub: "Let's Have Fun",
        navbar: ['Word Rain', 'Match Pair', 'Word Quiz', 'Sarangbang', 'Suggest'],
        langDisplay: "🇺🇸 EN",
        accountLabel: "Account",
        auth: { login: "Log In", signup: "Sign Up" },
        heroTitle: "Hangeul Play Yard",
        heroSub: "Enjoy K-Culture",
        heroDesc: "Master Hangeul through K-Pop, K-Drama, and K-Food.",
        cards: [
            { t: 'Word Rain', d: 'Conquer words falling like rain.' },
            { t: 'Match Pair', d: 'Connect meanings and words.' },
            { t: 'Word Quiz', d: 'Prove your skills with quizzes.' }
        ],
        lobby: {
            title: "Word Rain",
            subTitle: "QUEST LOBBY",
            desc: "Become a master of Hangeul step-by-step.",

            placeholder: "Type word and press Enter",
            modeHangeul: "Hangeul Mode",
            modeMeaning: "Meaning Mode",
            startBtn: "START QUEST",
            levels: [
                { id: 1, name: 'Beginner', desc: 'Consonants/Vowels', locked: false },
                { id: 2, name: 'Novice', desc: 'Basic K-Culture', locked: true },
                { id: 3, name: 'Intermediate', desc: 'Daily Terms', locked: true },
                { id: 4, name: 'Skilled', desc: 'Lines & Lyrics', locked: true },
                { id: 5, name: 'Expert', desc: 'Advanced Lyrics', locked: true },
                { id: 6, name: 'Master', desc: 'Native Mastery', locked: true }
            ]
        }
    },
    es: {
        brand: "Patio de Hangeul",
        introSub: "¡Divirtámonos!",
        navbar: ['Lluvia', 'Parejas', 'Examen', 'Sarangbang', 'Sugerir'],
        langDisplay: "🇪🇸 ES",
        accountLabel: "Cuenta",
        auth: { login: "Acceder", signup: "Registro" },
        heroTitle: "Patio de Hangeul",
        heroSub: "Vive la K-Cultura",
        heroDesc: "Domina el Hangeul con K-Pop y K-Drama.",
        cards: [
            { t: 'Lluvia de Palabras', d: 'Domina las palabras que caen.' },
            { t: 'Emparejar', d: 'Une conceptos y letras.' },
            { t: 'Quiz', d: 'Demuestra tu nivel.' }
        ],
        lobby: {
            title: "Lluvia", subTitle: "MISIÓN", desc: "Sé un maestro del Hangeul.",

            placeholder: "Escribe y presiona Enter",
            modeHangeul: "Hangeul", modeMeaning: "Significado", startBtn: "¡VAMOS!",
            levels: [
                { id: 1, name: 'Principiante', desc: 'Alfabeto', locked: false },
                { id: 2, name: 'Novato', desc: 'Cultura K Básica', locked: true },
                { id: 3, name: 'Intermedio', desc: 'Términos Diarios', locked: true },
                { id: 4, name: 'Habilidoso', desc: 'Letras K-Pop', locked: true },
                { id: 5, name: 'Experto', desc: 'Letras Avanzadas', locked: true },
                { id: 6, name: 'Maestro', desc: 'Nivel Nativo', locked: true }
            ]
        }
    },
    jp: {
        brand: "ハングル遊び場",
        introSub: "楽しく遊ぼう",
        navbar: ['ハングルの雨', 'ペア合わせ', '文字解き', 'サランバン', '提案'],
        langDisplay: "🇯🇵 JP",
        accountLabel: "アカウント",
        auth: { login: "ログイン", signup: "新規登録" },
        heroTitle: "ハングル遊び場",
        heroSub: "K-Cultureを攻略せよ",
        heroDesc: "K-Popやドラマでハングルの本質を学ぼう。",
        cards: [
            { t: 'ハングルの雨', d: '降ってくる単語を攻略せよ。' },
            { t: 'ペア合わせ', d: '正しいペアを繋げよう。' },
            { t: '文字解き', d: 'クイズで実力を証明。' }
        ],
        lobby: {
            title: "ハングルの雨", subTitle: "ロビー", desc: "段階的に達人を目指そう。",

            placeholder: "単語を入力してエンター",
            modeHangeul: "ハングル入力", modeMeaning: "意味入力", startBtn: "進격!",
            levels: [
                { id: 1, name: '入門', desc: '子音/母音', locked: false },
                { id: 2, name: '初級', desc: '基礎単語', locked: true },
                { id: 3, name: '中級', desc: '日常用語', locked: true },
                { id: 4, name: '熟練', desc: 'セリフ・歌詞', locked: true },
                { id: 5, name: '専門', desc: '深化セリフ', locked: true },
                { id: 6, name: '大家', desc: 'ネイティブレベル', locked: true }
            ]
        }
    }
};