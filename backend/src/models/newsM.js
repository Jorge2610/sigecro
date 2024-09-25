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
                "SELECT id, name, active FROM news_sources;"
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
}

export { News };
