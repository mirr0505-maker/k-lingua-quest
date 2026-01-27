import { createClient } from '@supabase/supabase-js'

// 수파베이스 대시보드 Settings -> API에서 복사한 값
const supabaseUrl = 'https://qxwphvpydikrgvbnbzlz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4d3BodnB5ZGlrcmd2Ym5iemx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MDU2MzUsImV4cCI6MjA4NDk4MTYzNX0.x6MwzMi3S4k69CdqJ78c7BWbCvobXl6c1p6apY0RN1g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)