import { query } from "../config/db.js";

class URLs {
    /**
     * Executes a batch insert of URLs with user IDs and category IDs into the database.
     *
     * @param {string} valuesPlaceholders - The SQL query placeholders for the batch insert.
     * @param {Array} values - An array of URL, user ID and category ID to be inserted.
     * @returns {Promise<number>} Resolves to HTTP status code 200 on success.
     */
    static async setURLsBatch(valuesPlaceholders, values) {
        await query(
            `INSERT INTO urls(url, user_id, category_id) VALUES${valuesPlaceholders};`,
            values
        );
        return 200;
    }

    /**
     * Inserts multiple URLs into the `urls` table.
     *
     * @param {Array<string>} values - An array of URLs to insert.
     * @returns {Promise<number>} Resolves to 200 if the insertion is successful.
     */
    static async setURLsBatchDefault(values) {
        const valuesPlaceholders = getPlaceHolders(values);
        await query(
            `INSERT INTO urls(url) VALUES ${valuesPlaceholders};`,
            values
        );
        return 200;
    }

    /**
     * Retrieves the first URL from the database.
     *
     * @returns {Promise<QueryResult>} A Promise that resolves to a QueryResult object containing the first URL.
     */
    static async getFirstURL() {
        const result = await query(`SELECT * FROM public.urls LIMIT 1;`);
        if (result.rows.length > 0) {
            result.rows[0].trys = 0;
        }
        return result.rows;
    }

    /**
     * Retrieves a list of all URLs with associated user information.
     *
     * @static
     * @returns {Promise<QueryResult>} A Promise that resolves to a QueryResult object containing a list of URL objects with the following properties:
     *  - id: The unique identifier of the URL (number).
     *  - url: The actual URL string.
     *  - user_name: The username of the user who created the URL (string).
     */
    static async getURLs() {
        const result = await query(`SELECT ur.id, ur.url, us.name AS user_name 
                            FROM urls ur
                            INNER JOIN users us ON ur.user_id = us.id;
            `);
        return result.rows;
    }

    /**
     * Deletes a URL record from the `urls` table based on its ID.
     *
     * @param {number} id - The ID of the URL to be deleted.
     * @returns {Promise<boolean>} Resolves with 200 if the URL was successfully deleted.
     */
    static async deleteURL(id) {
        await query(`DELETE FROM urls WHERE id = $1;`, id);
        return 200;
    }

    /**
     * Deletes multiple URLs from the `urls` table based on an array of URL IDs.
     *
     * @param {number[]} ids - An array of URL IDs to be deleted.
     * @returns {Promise<boolean>} Resolves with 200 if the deletion was successful.
     */
    static async deleteURLs(ids) {
        const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
        await query(`DELETE FROM urls WHERE id IN (${placeholders});`, ids);
        return 200;
    }
}

/**
 * Generates SQL placeholders for batch default inserting.
 *
 * @param {Array} values - An array of values to generate placeholders for.
 * @returns {string} A string of SQL placeholders for the `VALUES` clause.
 */
const getPlaceHolders = (values) => {
    let placeholders = "";
    for (let i = 1; i <= values.length; i++) {
        placeholders += `($${i})`;
        if (i !== values.length) {
            placeholders += ", ";
        }
    }
    return placeholders;
};

export default URLs;
