import { query } from "../config/db.js";

class URLs {
    /**
     * Executes a batch insert of URLs and user IDs into the database.
     *
     * @param {string} valuesPlaceholders - The SQL query placeholders for the batch insert.
     * @param {Array} values - An array of URL and user ID pairs to be inserted.
     * @returns {Promise<number>} Resolves to HTTP status code 200 on success, or 503 on failure.
     */
    static async setURLsBatch(valuesPlaceholders, values) {
        try {
            await query(
                `INSERT INTO urls(url, user_id, category_id) VALUES${valuesPlaceholders};`,
                values
            );
            return 200;
        } catch (error) {
            console.error("Error al insertar URLs", error);
            return 503;
        }
    }

    /**
     * Retrieves all URLs from the `urls` table in the database.
     * Each retrieved URL has a `trys` property initialized to 0.
     *
     * @returns {Promise<Array<Object>>} Resolves with an array of URL objects, each having a `trys` property set to 0.
     * If an error occurs, it returns an empty array.
     */
    static async getURLs() {
        try {
            const result = await query(`SELECT * FROM public.urls;`);
            result.rows.map((row) => {
                row.trys = 0;
            });
            return result.rows;
        } catch (error) {
            console.error("Error al recuperar URLs", error);
            return [];
        }
    }

    /**
     * Deletes multiple URLs from the `urls` table based on an array of URL IDs.
     *
     * @param {number[]} processedURLsIds - An array of URL IDs to be deleted.
     * @returns {Promise<boolean>} Resolves with `true` if the deletion was successful, otherwise returns `false`.
     */
    static async deleteURLs(processedURLsIds) {
        const placeholders = processedURLsIds
            .map((_, i) => `$${i + 1}`)
            .join(", ");
        try {
            await query(
                `DELETE FROM urls WHERE id IN (${placeholders});`,
                processedURLsIds
            );
            return true;
        } catch (error) {
            console.error("Error al eliminar URLs", error);
            return false;
        }
    }
}

export default URLs;
