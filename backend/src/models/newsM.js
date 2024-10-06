import { query } from "../config/db.js";

class News {
    /**
     * Creates a new news item in the database.
     *
     * @param {object} data - An object containing the news item's data.
     * @return {array} An array of objects representing the newly created news item.
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
     * Retrieves a news item by its id.
     *
     * @param {number} id - The id of the news item to retrieve.
     * @return {array} An array of objects representing the news item.
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
     * @param {string} search - The search query.
     * @param {number} [limit=10] - The maximum number of results to return.
     * @param {number} [page=1] - The page number of the results.
     * @param {number} [short_order=0] - The order of the results.
     * @param {array} [categories=null] - The categories to filter by.
     * @param {date} [start_date=null] - The start date of the range to filter by.
     * @param {date} [end_date=null] - The end date of the range to filter by.
     * @param {array} [sources=null] - The sources to filter by.
     * @param {array} [filter_tags=null] - The tags to filter by.
     * @return {array} An array of news items that match the search query.
     */
    static async searchBasicNews(
        search,
        limit = 10,
        page = 1,
        short_order = 0,
        categories = null,
        start_date = null,
        end_date = null,
        sources = null,
        filter_tags = null
    ) {
        try {
            const res = await query(
                `select * 
                 from basic_search_news($1::text, $2::integer, $3::integer, $4::integer, $5::bigint[], 
                 $6::timestamp, $7::timestamp, $8::varchar[], $9::varchar[])`,
                [
                    search,
                    page,
                    limit,
                    short_order,
                    categories === "null" ? null : JSON.parse(categories),
                    start_date,
                    end_date,
                    sources === "null" ? null : JSON.parse(sources),
                    filter_tags === "null" ? null : JSON.parse(filter_tags),
                ]
            );
            return res.rows;
        } catch (e) {
            console.log(e);
        }
    }

    
    /**
     * Performs an advanced search for news based on the provided filters.
     *
     * @param {array} filters - An array of filters to apply to the search.
     * @param {number} [limit=10] - The maximum number of results to return.
     * @param {number} [page=1] - The page number of the results.
     * @param {number} [short_order=0] - The order of the results.
     * @param {array} [categories=null] - The categories to filter by.
     * @param {date} [start_date=null] - The start date of the range to filter by.
     * @param {date} [end_date=null] - The end date of the range to filter by.
     * @param {array} [sources=null] - The sources to filter by.
     * @param {array} [filter_tags=null] - The tags to filter by.
     * @return {array} An array of news items that match the filters.
     */
    static async searchAdvancedNews(
        filters,
        limit = 10,
        page = 1,
        short_order = 0,
        categories = null,
        start_date = null,
        end_date = null,
        sources = null,
        filter_tags = null
    ) {
        try {
            const res = await query(
                `select * 
            from advanced_search_news($1::jsonb, $2, $3, $4, $5,
             $6::timestamp, $7::timestamp, $8, $9)`,
                [
                    filters,
                    page,
                    limit,
                    short_order,
                    JSON.parse(categories),
                    start_date,
                    end_date,
                    JSON.parse(sources),
                    JSON.parse(filter_tags),
                ]
            );
            return res.rows;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Saves the tags of a news item in the database.
     *
     * @param {number} newsId - The ID of the news item.
     * @param {object} tags - An object containing the tags of the news item.
     * @return {array} An array of fields provided by the query.
     */
    static async setTags(newsId, tags) {
        const res = await query("call insert_tags($1, $2)", [newsId, tags]);
        return res.rows;
    }

    /**
     * Retrieves a list of news sources from the database, including their IDs, names, and active statuses.
     *
     * @returns {Promise<Object[]>} Resolves with an array of news sources, each containing an `id`, `name`, and `active` status.
     * @throws {Error} Throws an error if the database connection fails.
     */
    static async getSources() {
        try {
            const result = await query(
                "SELECT id, name, active, last_date FROM news_sources ORDER BY id ASC;"
            );
            return result.rows;
        } catch (error) {
            console.error("newsM getSources ERROR: ", error);
            throw new Error("Data Base connection refused!");
        }
    }

    /**
     * Retrieves a list of news topics from the database, including their IDs, associated news source IDs, names, and active statuses.
     *
     * @returns {Promise<Object[]>} Resolves with an array of news topics, each containing an `id`, `news_source_id`, `name`, and `active` status.
     * @throws {Error} Throws an error if the database connection fails.
     */
    static async getTopics() {
        try {
            const result = await query(
                "SELECT id, news_source_id, name, active FROM news_topics;"
            );
            return result.rows;
        } catch (error) {
            console.error("newsM getTopics ERROR: ", error);
            throw new Error("Data Base connection refused!");
        }
    }

    /**
     * Retrieves the topics associated with a specific news source by its ID.
     *
     * @param {number} news_id - The ID of the news source.
     * @returns {Promise<Array<Object>>} Resolves to an array of topics, each containing the topic name and its active state.
     * @throws {Error} Throws an error if the database connection fails.
     */
    static async getTopicsBySource(news_id) {
        try {
            const result = await query(
                "SELECT name, active FROM news_topics WHERE news_source_id = $1;",
                [news_id]
            );
            return result.rows;
        } catch (error) {
            console.error("ERROR newsM getTopics\n", error);
            throw new Error("Data Base connection refused!");
        }
    }

    /**
     * Updates the `last_date` field for multiple news sources in the database.
     *
     * @param {Array<Object>} sources - An array of source objects, each containing the `id` and `last_date`.
     * @returns {Promise<number>} Resolves to 204 if the update is successful.
     * @throws {Error} Throws an error if the database connection fails.
     */
    static async setSourcesLastDate(sources) {
        try {
            let values = [];
            sources.map((source) => {
                values = [...values, source.id, source.last_date];
            });
            const placeholders = getTopicsPlaceholders(values);
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
        } catch (error) {
            console.error("ERROR newsM setSourcesLastDate\n", error);
            throw new Error("Data Base connection refused!");
        }
    }

    /**
     * Updates the active state of a news source in the database.
     *
     * @param {number} id - The ID of the news source to update.
     * @param {boolean} state - The new active state of the news source.
     * @returns {Promise<number>} Returns 204 if the update is successful.
     * @throws {Error} Throws an error if the database connection fails.
     */
    static async setSourceState(id, state) {
        try {
            await query(`UPDATE news_sources SET active = $1 WHERE id = $2;`, [
                state,
                id,
            ]);
            return 204;
        } catch (error) {
            console.error("newsM getTopics ERROR: ", error);
            throw new Error("Data Base connection refused!");
        }
    }

    /**
     * Updates the active state of multiple news topics in the database.
     *
     * @param {Array} values - An array of topic IDs and their corresponding active states.
     * @returns {Promise<number>} Returns 204 if the update is successful.
     * @throws {Error} Throws an error if the database connection fails.
     */
    static async setTopicsState(values) {
        const placeholders = getTopicsPlaceholders(values);
        try {
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
        } catch (error) {
            console.error("newsM setTopicsState ERROR: ", error);
            throw new Error("Data Base connection refused!");
        }
    }

    /**
     * Retrieves all the news sources from the database, excluding duplicates.
     *
     * @returns {Promise<Object[]>} Resolves to an array of objects containing the source name.
     * @throws {Error} Throws an error if the database connection fails.
     */
    static async getAllSources() {
        try {
            const result = await query(
                "SELECT source FROM news WHERE status like 'published' GROUP BY source ORDER BY source ASC;"
            );
            return result.rows;
        } catch (error) {
            console.error("newsM getSources ERROR: ", error);
            throw new Error("Data Base connection refused!");
        }
    }

    /**
     * Retrieves the 10 most used tags in the news database, with their count.
     *
     * @returns {Promise<Object[]>} Resolves to an array of objects containing the tag id, name, and count.
     * @throws {Error} Throws an error if the database connection fails.
     */
    static async getMostUsedTags() {
        try {
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
        } catch (error) {
            console.error("newsM getMostUsedTags ERROR: ", error);
            throw new Error("Data Base connection refused!");
        }
    }
}

/**
 * Generates SQL placeholders for updating multiple news topics' states.
 *
 * @param {Array} values - An array of topic IDs and their active states.
 * @returns {string} A string of SQL placeholders for the `VALUES` clause.
 */
const getTopicsPlaceholders = (values) => {
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
