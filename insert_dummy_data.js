
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qxwphvpydikrgvbnbzlz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4d3BodnB5ZGlrcmd2Ym5iemx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MDU2MzUsImV4cCI6MjA4NDk4MTYzNX0.x6MwzMi3S4k69CdqJ78c7BWbCvobXl6c1p6apY0RN1g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertStats() {
    console.log("Inserting dummy data...");
    const dummies = [
        { nickname: 'BlackShadow', score: 2500, level: 3, country_code: 'KR' },
        { nickname: 'NeoStriker', score: 1800, level: 3, country_code: 'US' },
        { nickname: 'K-Master', score: 1500, level: 2, country_code: 'JP' },
        { nickname: 'LinguaOne', score: 1200, level: 1, country_code: 'ES' },
        { nickname: 'HangulPro', score: 950, level: 2, country_code: 'FR' }
    ];

    const { data, error } = await supabase
        .from('hangeul_rankings')
        .insert(dummies);

    if (error) console.error("Error inserting:", error);
    else console.log("Dummy data inserted successfully.");
}

insertStats();
