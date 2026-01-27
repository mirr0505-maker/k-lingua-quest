
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qxwphvpydikrgvbnbzlz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4d3BodnB5ZGlrcmd2Ym5iemx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MDU2MzUsImV4cCI6MjA4NDk4MTYzNX0.x6MwzMi3S4k69CdqJ78c7BWbCvobXl6c1p6apY0RN1g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRankings() {
    console.log("Checking hangeul_rankings table...");
    const { data, error } = await supabase
        .from('hangeul_rankings')
        .select('nickname, score, country_code')
        .order('score', { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching data:", error);
    } else {
        console.log("Data fetched successfully:");
        if (data.length === 0) {
            console.log("NO DATA FOUND. The ticker will show 'Initializing...' or empty.");
        } else {
            console.log(`Found ${data.length} records.`);
            data.forEach((rank, i) => {
                console.log(`#${i + 1}: ${rank.nickname} (${rank.country_code}) - ${rank.score}`);
            });
        }
    }
}

checkRankings();
