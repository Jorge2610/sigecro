-- Extensions for Basic Search News : unaccent words
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Functions for Basic Search News
DROP FUNCTION IF EXISTS basic_search_news;

CREATE OR REPLACE FUNCTION public.basic_search_news(
    search_term text,
    page_num integer DEFAULT 1,
    page_size integer DEFAULT 10,
    short_order integer DEFAULT 0,
    categories BIGINT[] DEFAULT NULL,
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
            array_agg(DISTINCT t.id) as tag_ids,
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
            (categories IS NULL OR nwt.category_id = ANY(categories))AND
            (start_date IS NULL OR nwt.date > start_date) AND
            (end_date IS NULL OR nwt.date < end_date) AND
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

DROP FUNCTION IF EXISTS build_search_query;

CREATE OR REPLACE FUNCTION public.build_search_query(search_query jsonb)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    result text := '';
    partial_query text := '';
    query jsonb;
    field text;
    value text;
    operator text;
BEGIN
    FOR query IN SELECT * FROM jsonb_array_elements(search_query)
    LOOP
        IF result != '' THEN
            result := result || ' ' || COALESCE(query->>'logic', 'AND') || ' ';
        END IF;

        field := (SELECT jsonb_object_keys((query->'conditions')::jsonb));
        value := (query->'conditions'->field->>'value')::text;
        operator := COALESCE((query->'conditions'->field->>'operator')::text, '');

        CASE field
            WHEN 'all_fields' THEN
                partial_query := format(
                    '(to_tsvector(''spanish'', unaccent(title || '' '' || content || '' '' || summary)) @@ plainto_tsquery(''spanish'', unaccent(%L)) ' ||
                    'OR EXISTS (SELECT 1 FROM unnest(tags) tag WHERE unaccent(tag) ILIKE unaccent(%L)))',
                    value, '%' || value || '%'
                );
            WHEN 'title' THEN
                partial_query := format('to_tsvector(''spanish'', unaccent(title)) @@ plainto_tsquery(''spanish'', unaccent(%L))', value);
            WHEN 'content' THEN
                partial_query := format('to_tsvector(''spanish'', unaccent(content)) @@ plainto_tsquery(''spanish'', unaccent(%L))', value);
            WHEN 'summary' THEN
                partial_query := format('to_tsvector(''spanish'', unaccent(summary)) @@ plainto_tsquery(''spanish'', unaccent(%L))', value);
            WHEN 'tags' THEN
                partial_query := format('EXISTS (SELECT 1 FROM unnest(tags) tag WHERE unaccent(tag) ILIKE unaccent(%L))', '%' || value || '%');
            ELSE
                RAISE EXCEPTION 'Campo de búsqueda no válido: %', field;
        END CASE;

        IF operator = 'NOT' OR (query->>'logic')::text = 'NOT' THEN
            result := result || 'NOT (' || partial_query || ')';
        ELSE
            result := result || '(' || partial_query || ')';
        END IF;
    END LOOP;

    RETURN COALESCE('(' || result || ')', '1=1');
END;
$function$

DROP FUNCTION IF EXISTS advanced_search_news;

CREATE OR REPLACE FUNCTION public.advanced_search_news(
    search_query jsonb,
    page_num integer DEFAULT 1, 
    page_size integer DEFAULT 10, 
    short_order integer DEFAULT 0, 
    categories character varying[] DEFAULT NULL::character varying[],
    start_date timestamp without time zone DEFAULT NULL::timestamp without time zone, 
    end_date timestamp without time zone DEFAULT NULL::timestamp without time zone,
    sources character varying[] DEFAULT NULL::character varying[],
    filter_tags character varying[] DEFAULT NULL::character varying[])
 RETURNS TABLE(id bigint, title character varying, content text, date timestamp without time zone, source character varying, url character varying, summary text, image_url character varying, status character varying, category_id bigint, user_id bigint, tags character varying[], total_count bigint)
 LANGUAGE plpgsql
AS $function$
DECLARE
    query text;
    where_clause text := ' WHERE 1=1 ';
    search_clause text;
    order_clause text;
BEGIN
    IF categories IS NOT NULL THEN
        where_clause := where_clause || ' AND c.id = ANY($1) ';
    END IF;
    IF start_date IS NOT NULL THEN
        where_clause := where_clause || ' AND n.date >= $2 ';
    END IF;
    IF end_date IS NOT NULL THEN
        where_clause := where_clause || ' AND n.date <= $3 ';
    END IF;
    IF sources IS NOT NULL THEN
        where_clause := where_clause || ' AND n.source = ANY($4) ';
    END IF;
    IF filter_tags IS NOT NULL THEN
        where_clause := where_clause || ' AND EXISTS (SELECT 1 FROM unnest(tags) tag WHERE unaccent(tag) ILIKE ANY(SELECT unaccent(''%'' || ft || ''%'') FROM unnest($5::varchar[]) ft)) ';
    END IF;

    search_clause := build_search_query(search_query);

    order_clause := CASE
        WHEN short_order = 1 THEN ' ORDER BY date DESC '
        WHEN short_order = 2 THEN ' ORDER BY date ASC '
        WHEN short_order = 3 THEN ' ORDER BY title ASC '
        WHEN short_order = 4 THEN ' ORDER BY title DESC '
        ELSE ' ORDER BY date DESC '
    END;

    query := '
    WITH news_with_tags AS (
        SELECT 
            n.id, n.title, n.content, n.date, n.source, n.url, n.summary, n.image_url, n.status,
            n.category_id, n.user_id, c.name as category,
            array_agg(DISTINCT t.name) as tags,
            array_agg(DISTINCT t.id) as tag_ids
        FROM news n
        INNER JOIN categories c ON n.category_id = c.id
        LEFT JOIN news_tag nt ON n.id = nt.news_id
        LEFT JOIN tags t ON nt.tag_id = t.id
        ' || where_clause || '
        GROUP BY n.id, n.title, n.content, n.date, n.source, n.url, n.summary, n.image_url, n.status,
                 n.category_id, n.user_id, c.name
    )
    SELECT 
        id, title, content, date, source, url, summary, image_url, status,
        category_id, user_id, tags,
        COUNT(*) OVER() AS total_count
    FROM news_with_tags
    WHERE ' || search_clause || '
    ' || order_clause || '
    LIMIT $7
    OFFSET $8';

    RETURN QUERY EXECUTE query 
    USING 
        categories, start_date, end_date, sources, filter_tags, 
        search_query, page_size, (page_num - 1) * page_size;
END;
$function$