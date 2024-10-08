import { query } from "../config/db.js";

class News {
    /**
     * Creates a new news item in the database.
     *
     * @param {object[]} data - An array of values containing the news data (title, content, date, source, url, summary, image_url, status, category_id, user_id).
     * @returns {Promise<QueryResult>} A Promise that resolves to a QueryResult object containing the newly created news item.
     */
    static async create(data) {
        const res = await query(
            `INSERT INTO news(title, content, date, source, url, summary, image_url, status, category_id, user_id)
       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            data
        );
        return res.rows;
    }

    /**
     * Retrieves a news item by its ID from the database.
     *
     * @param {number} id - The ID of the news item to retrieve.
     * @returns {Promise<QueryResult>} A Promise that resolves to a QueryResult object containing the news item details and its associated tags and category name.
     */
    static async getById(id) {
        const res = await query(
            `SELECT
                    n.id,
                    n.title,
                    n.content,
                    n.date,
                    n.source,
                    n.url,
                    n.summary,
                    n.image_url,
                    n.status,
                    n.category_id,
                    c.name as category_name,
                    n.user_id,
                    array_agg(DISTINCT t.name) as tags,
                    c.name as category
                FROM
                    news n
                    LEFT JOIN news_tag nt ON n.id = nt.news_id
                    LEFT JOIN tags t ON nt.tag_id = t.id
                    INNER JOIN categories c ON n.category_id = c.id
                WHERE
                    n.id = $1
                GROUP BY
                    n.id,
                    n.title,
                    n.content,
                    n.date,
                    n.source,
                    n.url,
                    n.summary,
                    n.image_url,
                    n.status,
                    n.category_id,
                    n.user_id,
                    c.name`,
            [id]
        );
        return res.rows;
    }

    /**
     * Performs a basic search for news based on the provided search query.
     *
     * @param {{}} params - An object with all the required params for que query.
     * @returns {Promise<QueryResult>} A Promise that resolves to a QueryResult object containing the search results.
     */
    static async searchBasicNews(params) {
        const res = await query(
            `select * 
                 from basic_search_news($1::text, $2::integer, $3::integer, $4::integer, $5::bigint[], 
                 $6::timestamp, $7::timestamp, $8::varchar[], $9::varchar[])`,
            [
                params.search,
                params.page,
                params.limit,
                params.sort_order,
                params.categories === "null"
                    ? null
                    : JSON.parse(params.categories),
                params.start_date,
                params.end_date,
                params.sources === "null" ? null : JSON.parse(params.sources),
                params.filter_tags === "null"
                    ? null
                    : JSON.parse(params.filter_tags),
            ]
        );
        return res.rows;
    }

    /**
     * Performs an advanced search for news based on the provided filters.
     *
     * @param {{}} params - An object with all the required params for que query.
     * @returns {Promise<QueryResult>} A Promise that resolves to a QueryResult object containing the search results.
     */
    static async searchAdvancedNews(params) {
        const res = await query(
            `select * 
            from advanced_search_news($1::jsonb, $2, $3, $4, $5,
             $6::timestamp, $7::timestamp, $8, $9)`,
            [
                params.filters,
                params.page,
                params.limit,
                params.sort_order,
                JSON.parse(params.categories),
                params.start_date,
                params.end_date,
                JSON.parse(params.sources),
                JSON.parse(params.filter_tags),
            ]
        );
        return res.rows;
    }

    /**
     * Sets the tags for a news item.
     *
     * @param {number} newsId - The ID of the news item.
     * @param {string[]} tags - An array of tags to associate with the news item.
     * @returns {Promise<QueryResult>} A Promise that resolves to a QueryResult object containing the result of the operation.
     */
    static async setTags(newsId, tags) {
        const res = await query("call insert_tags($1, $2)", [newsId, tags]);
        return res.rows;
    }

    /**
     * Retrieves a list of news sources.
     *
     * @returns {Promise<QueryResult>} A Promise that resolves to a QueryResult object containing the list of news sources.
     */
    static async getSources() {
        const result = await query(
            "SELECT id, name, active, last_date FROM news_sources ORDER BY id ASC;"
        );
        return result.rows;
    }

    /**
     * Retrieves a list of news topics.
     *
     * @returns {Promise<QueryResult>} A Promise that resolves to a QueryResult object containing the list of news topics.
     */
    static async getTopics() {
        const result = await query(
            "SELECT id, news_source_id, name, active FROM news_topics;"
        );
        return result.rows;
    }

    /**
     * Retrieves a list of news topics associated with a specific news source.
     *
     * @param {number} news_id - The ID of the news source.
     * @returns {Promise<QueryResult>} A Promise that resolves to a QueryResult object containing the list of news topics.
     */
    static async getTopicsBySource(news_id) {
        const result = await query(
            "SELECT name, active FROM news_topics WHERE news_source_id = $1;",
            [news_id]
        );
        return result.rows;
    }

    /**
     * Updates the `last_date` field for a batch of news sources.
     *
     * @param {object[]} sources - An array of objects containing source ID and new `last_date` values.
     * @returns {Promise<number>} A Promise that resolves to 204 (No Content) on successful update.
     */
    static async setSourcesLastDate(sources) {
        let values = [];
        sources.map((source) => {
            values = [...values, source.id, source.last_date];
        });
        const placeholders = getPlaceholders(values);
        await query(
            `
                UPDATE news_sources AS t
                SET last_date = data.last_date::date
                FROM (VALUES ${placeholders}) AS data (id, last_date )
                WHERE t.id = data.id::bigint;
                `,
            values
        );
        return 204;
    }

    /**
     * Updates the active state of a news source.
     *
     * @param {number} id - The ID of the news source.
     * @param {boolean} state - The new active state (true or false).
     * @returns {Promise<number>} A Promise that resolves to 204 (No Content) on successful update.
     */
    static async setSourceState(id, state) {
        await query(`UPDATE news_sources SET active = $1 WHERE id = $2;`, [
            state,
            id,
        ]);
        return 204;
    }

    /**
     * Updates the active state of multiple news topics in the database.
     *
     * @param {Array} values - An array of topic IDs and their corresponding active states.
     * @returns {Promise<number>} Returns 204 if the update is successful.
     */
    static async setTopicsState(values) {
        const placeholders = getPlaceholders(values);
        await query(
            `
                UPDATE news_topics AS t
                SET active = data.active::boolean
                FROM (VALUES ${placeholders}) AS data (id, active )
                WHERE t.id = data.id::bigint;
                `,
            values
        );
        return 204;
    }

    /**
     * Retrieves all the news sources from the database, excluding duplicates.
     *
     * @returns {Promise<Object[]>} Resolves to an array of objects containing the source name.
     */
    static async getAllSources() {
        const result = await query(
            "SELECT source FROM news WHERE status like 'published' GROUP BY source ORDER BY source ASC;"
        );
        return result.rows;
    }

    /**
     * Retrieves the 10 most used tags in the news database, with their count.
     *
     * @returns {Promise<Object[]>} Resolves to an array of objects containing the tag id, name, and count.
     */
    static async getMostUsedTags() {
        const result = await query(
            `SELECT t.id, t.name, COUNT(*) as Frecuency
                FROM tags t
                JOIN news_tag nt ON t.id = nt.tag_id
                GROUP BY
                t.id
                ORDER BY Frecuency DESC
            LIMIT 10;`
        );
        return result.rows;
    }
}

/**
 * Generates SQL placeholders for updating multiple news topics' states.
 *
 * @param {Array} values - An array of topic IDs and their active states.
 * @returns {string} A string of SQL placeholders for the `VALUES` clause.
 */
const getPlaceholders = (values) => {
    let placeholders = "";
    for (let i = 1; i < values.length; i += 2) {
        placeholders += `($${i}, $${i + 1})`;
        if (i + 1 !== values.length) {
            placeholders += ", ";
        }
    }
    return placeholders;
};

export { News };
