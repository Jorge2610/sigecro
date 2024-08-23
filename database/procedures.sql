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
