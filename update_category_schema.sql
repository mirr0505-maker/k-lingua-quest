-- 1. 카테고리 컬럼 추가
ALTER TABLE k_vocabulary 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';

-- 2. 카테고리별 데이터 샘플 삽입 (예시)
-- UPDATE k_vocabulary SET category = 'K-Food' WHERE hangeul IN ('비빔밥', '김치', '불고기');
-- UPDATE k_vocabulary SET category = 'K-Pop' WHERE hangeul IN ('아이돌', '응원봉', '데뷔');
-- UPDATE k_vocabulary SET category = 'K-Drama' WHERE hangeul IN ('재벌', '첫사랑', '복수');

-- 3. 카테고리별 단어 추출 RPC 함수
CREATE OR REPLACE FUNCTION get_words_by_category(selected_category TEXT, limit_num INT)
RETURNS SETOF k_vocabulary AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM k_vocabulary 
    WHERE category = selected_category
    ORDER BY RANDOM() 
    LIMIT limit_num;
END;
$$ LANGUAGE plpgsql;
