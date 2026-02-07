-- 1. K-Food가 아닌 모든 카테고리 데이터 삭제
DELETE FROM public.vocabulary 
WHERE category IS NULL OR category != 'K-Food';

-- 2. 남은 데이터 확인 (정말 K-Food만 남았는지 체크)
SELECT category, count(*) 
FROM public.vocabulary 
GROUP BY category;
