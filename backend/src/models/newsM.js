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
     * Searches for news based on a search term.
     *
     * @param {string} search - The search term to look for.
     * @param {number} [limit=10] - The maximum number of results to return.
     * @param {number} [page=1] - The page number of the results.
     * @return {array} An array of news items that match the search term.
     */
    static async searchBasicNews(search, limit = 10, page = 1) {
        const res = await query("select * from basic_search_news($1, $2, $3)", [
            search,
            page,
            limit,
        ]);
        return res.rows;
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
                "SELECT id, name, active FROM news_sources ORDER BY id ASC;"
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
