
const { createClient } = require('@supabase/supabase-js');

// 수파베이스 대시보드 Settings -> API에서 복사한 값 (src/supabaseClient.js 내용)
const supabaseUrl = 'https://qxwphvpydikrgvbnbzlz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4d3BodnB5ZGlrcmd2Ym5iemx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MDU2MzUsImV4cCI6MjA4NDk4MTYzNX0.x6MwzMi3S4k69CdqJ78c7BWbCvobXl6c1p6apY0RN1g';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkKVocab() {
    console.log("Checking 'k_vocabulary' table...");
    const { data, error } = await supabase
        .from('k_vocabulary') // 사용자가 언급한 테이블명
        .select('*')
        .limit(5);

    if (error) {
        console.error("Error fetching k_vocabulary:", error.message);
        console.log("Trying 'vocabulary' table instead...");

        const { data: vData, error: vError } = await supabase
            .from('vocabulary')
            .select('*')
            // K-Food 카테고리 확인
            .eq('category', 'K-Food')
            .limit(5);

        if (vError) {
            console.error("Error fetching vocabulary:", vError.message);
        } else {
            console.log("Found 'vocabulary' table with K-Food items:", vData.length);
            if (vData.length > 0) console.log("Sample:", vData[0]);
        }
    } else {
        console.log("Found 'k_vocabulary' table:", data.length);
        if (data.length > 0) console.log("Sample:", data[0]);
    }
}

checkKVocab();
