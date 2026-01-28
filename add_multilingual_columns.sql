-- k_vocabulary 테이블에 다국어 컬럼 추가
ALTER TABLE k_vocabulary 
ADD COLUMN IF NOT EXISTS meaning_es TEXT,
ADD COLUMN IF NOT EXISTS meaning_jp TEXT;

-- (선택) 데이터 확인용 쿼리
-- SELECT id, hangeul, meaning, meaning_es, meaning_jp FROM k_vocabulary;
