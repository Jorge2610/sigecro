-- Active: 1721333250909@@127.0.0.1@1010@sigecro_db
-- Index for full search text
CREATE INDEX IF NOT EXISTS idx_news_search_vector ON news USING GIN (
    (setweight(to_tsvector('spanish', coalesce(title, '')), 'B') ||
     setweight(to_tsvector('spanish', coalesce(summary, '')), 'C') ||
     setweight(to_tsvector('spanish', coalesce(content, '')), 'C') ||
     setweight(to_tsvector('spanish', coalesce(source, '')), 'D'))
);

-- Index for tags
CREATE INDEX IF NOT EXISTS idx_news_tag_news_id ON news_tag (news_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags USING GIN (to_tsvector('spanish', name));