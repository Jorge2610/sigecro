-- Extensions for Basic Search News : unaccent words
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Functions for Basic Search News
DROP FUNCTION basic_search_news;

CREATE OR REPLACE FUNCTION public.basic_search_news(
    search_term text,
    page_num integer DEFAULT 1,
    page_size integer DEFAULT 10,
    short_order integer DEFAULT 0,
    categories varchar(64)[] DEFAULT NULL,
    start_date timestamp DEFAULT NULL,
    end_date timestamp DEFAULT NULL,
    sources varchar(64)[] DEFAULT NULL,
    filter_tags varchar(20)[] DEFAULT NULL
)
 RETURNS TABLE(
    id bigint,
    title varchar(255),
    content text,
    date timestamp,
    source varchar(64),
    url varchar(255),
    summary text,
    image_url varchar(300),
    status varchar(64),
    category_id bigint,
    category_name varchar(128),
    user_id bigint,
    tags varchar(20)[],
    total_count bigint
)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    WITH news_with_tags AS (
        SELECT 
            n.id, n.title, n.content, n.date, n.source, n.url, n.summary, n.image_url, n.status,
            n.category_id, c.name as category_name, n.user_id,
            array_agg(DISTINCT t.name) as tags,
            c.name as category
        FROM news n
        LEFT JOIN news_tag nt ON n.id = nt.news_id
        LEFT JOIN tags t ON nt.tag_id = t.id
        INNER JOIN categories c ON n.category_id = c.id
        GROUP BY n.id, n.title, n.content, n.date, n.source, n.url, n.summary, n.image_url, n.status,
                 n.category_id, n.user_id, c.name
    ),
    filtered_news AS (
        SELECT *
        FROM news_with_tags nwt
        WHERE
            (nwt.status = 'published') AND
            (categories IS NULL OR nwt.category = ANY(categories))AND
            (start_date IS NULL OR nwt.date >= start_date) AND
            (end_date IS NULL OR nwt.date <= end_date) AND
            (sources IS NULL OR nwt.source = ANY(sources)) AND
            (filter_tags IS NULL OR nwt.tags && filter_tags)
    ),
    search_results AS (
        SELECT
            fn.*,
            CASE
                WHEN search_term = '' THEN 0
                ELSE ts_rank(
                    setweight(to_tsvector('spanish', unaccent(array_to_string(fn.tags, ' '))), 'A') ||
                    setweight(to_tsvector('spanish', unaccent(COALESCE(fn.title, ''))), 'B') ||
                    setweight(to_tsvector('spanish', unaccent(COALESCE(fn.summary, ''))), 'C') ||
                    setweight(to_tsvector('spanish', unaccent(COALESCE(fn.content, ''))), 'C') ||
                    setweight(to_tsvector('spanish', unaccent(COALESCE(fn.source, ''))), 'D'),
                    plainto_tsquery('spanish', unaccent(search_term))
                )
            END AS rank
        FROM filtered_news fn
        WHERE 
            search_term = '' OR
            (
                to_tsvector('spanish', unaccent(array_to_string(fn.tags, ' '))) ||
                to_tsvector('spanish', unaccent(COALESCE(fn.title, ''))) ||
                to_tsvector('spanish', unaccent(COALESCE(fn.summary, ''))) ||
                to_tsvector('spanish', unaccent(COALESCE(fn.content, ''))) ||
                to_tsvector('spanish', unaccent(COALESCE(fn.source, '')))
                @@ plainto_tsquery('spanish', unaccent(search_term))
            )
    )
    SELECT 
        sr.id, sr.title, sr.content, sr.date, sr.source, sr.url, sr.summary, sr.image_url, sr.status,
        sr.category_id, sr.category_name, sr.user_id, sr.tags,
        COUNT(*) OVER() AS total_count
    FROM search_results sr
    ORDER BY 
        CASE WHEN short_order = 1 THEN sr.date END DESC,
        CASE WHEN short_order = 2 THEN sr.date END ASC,
        CASE WHEN short_order = 3 THEN sr.title END ASC,
        CASE WHEN short_order = 4 THEN sr.title END DESC,
        CASE WHEN short_order = 0 THEN sr.rank END DESC,
        CASE WHEN search_term = '' THEN 0 ELSE sr.rank END DESC,
        sr.date DESC
    LIMIT page_size
    OFFSET (page_num - 1) * page_size;
END;
$function$