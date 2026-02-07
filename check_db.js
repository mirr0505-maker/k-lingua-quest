
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
    console.log("Checking 'vocabulary' table...");
    const { data: vocabData, error: vocabError } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('category', 'K-Food')
        .limit(3);

    if (vocabError) console.error('Error fetching vocabulary:', vocabError.message);
    else console.log('Vocabulary (K-Food) sample:', vocabData?.length > 0 ? vocabData[0] : 'No data');

    console.log("\nChecking 'k_vocabulary' table...");
    const { data: kVocabData, error: kVocabError } = await supabase
        .from('k_vocabulary')
        .select('*')
        .limit(3);

    if (kVocabError) console.error("Error fetching k_vocabulary (might not exist):", kVocabError.message);
    else console.log('k_vocabulary sample:', kVocabData?.length > 0 ? kVocabData[0] : 'No data');
}

checkTables();
