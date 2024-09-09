-- Active: 1721333250909@@127.0.0.1@1010@sigecro_db@public
-- PROCEDURES

-- INSERT TAGS WITHOUT DUPLICATES
CREATE OR REPLACE PROCEDURE insert_tags(
    p_news_id BIGINT,
    p_tags VARCHAR(20)[]
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO tags (name)
    SELECT DISTINCT unnest(p_tags) AS name
    ON CONFLICT (name) DO NOTHING;

    WITH tag_ids AS (
        SELECT id
        FROM tags
        WHERE name = ANY(p_tags)
    ), existing_links AS (
        SELECT tag_id
        FROM news_tag
        WHERE news_id = p_news_id
    )
    INSERT INTO news_tag (news_id, tag_id)
    SELECT p_news_id, tag_ids.id
    FROM tag_ids
    WHERE NOT EXISTS (
        SELECT 1
        FROM existing_links
        WHERE existing_links.tag_id = tag_ids.id
    );
    COMMIT;
END;
$$;

CREATE OR REPLACE FUNCTION basic_search_news(
    search_term TEXT,
    page_num INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 10
)
RETURNS TABLE (
    id BIGINT,
    title VARCHAR(255),
    summary TEXT,
    date TIMESTAMP,
    source VARCHAR(64),
    url VARCHAR(255),
    image_url VARCHAR(300),
    tags TEXT[],
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH search_results AS (
        SELECT DISTINCT ON (n.id)
            n.id, n.title, n.summary, n.date, n.source, n.url, n.image_url,
            array_agg(t.name) FILTER (WHERE t.name IS NOT NULL) as tags,
            ts_rank(
                setweight(to_tsvector('spanish', string_agg(coalesce(t.name, ''), ' ')), 'A') ||
                setweight(to_tsvector('spanish', coalesce(n.title, '')), 'B') ||
                setweight(to_tsvector('spanish', coalesce(n.summary, '')), 'C') ||
                setweight(to_tsvector('spanish', coalesce(n.content, '')), 'C') ||
                setweight(to_tsvector('spanish', coalesce(n.source, '')), 'D'),
                plainto_tsquery('spanish', search_term)
            ) AS rank
        FROM news n
        LEFT JOIN news_tag nt ON n.id = nt.news_id
        LEFT JOIN tags t ON nt.tag_id = t.id
        WHERE 
            to_tsvector('spanish', string_agg(coalesce(t.name, ''), ' ')) ||
            to_tsvector('spanish', coalesce(n.title, '')) ||
            to_tsvector('spanish', coalesce(n.summary, '')) ||
            to_tsvector('spanish', coalesce(n.content, '')) ||
            to_tsvector('spanish', coalesce(n.source, ''))
            @@ plainto_tsquery('spanish', search_term)
        GROUP BY n.id
    )
    SELECT 
        sr.id, sr.title, sr.summary, sr.date, sr.source, sr.url, sr.image_url, sr.tags,
        COUNT(*) OVER() AS total_count
    FROM search_results sr
    ORDER BY sr.rank DESC, sr.date DESC
    LIMIT page_size
    OFFSET (page_num - 1) * page_size;
END;
$$ LANGUAGE plpgsql;
