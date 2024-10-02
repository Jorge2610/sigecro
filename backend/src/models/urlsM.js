import { query } from "../config/db.js";

class URLs {
    /**
     * Executes a batch insert of URLs with user IDs and category IDs into the database.
     *
     * @param {string} valuesPlaceholders - The SQL query placeholders for the batch insert.
     * @param {Array} values - An array of URL, user ID and category ID to be inserted.
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
     * Inserts multiple URLs into the `urls` table.
     *
     * @param {Array<string>} values - An array of URLs to insert.
     * @returns {Promise<number>} Resolves to 200 if the insertion is successful, or 503 if an error occurs.
     * @throws {Error} Logs an error if the insertion fails.
     */
    static async setURLsBatchDefault(values) {
        try {
            const valuesPlaceholders = getPlaceHolders(values);
            await query(
                `INSERT INTO urls(url) VALUES ${valuesPlaceholders};`,
                values
            );
            return 200;
        } catch (error) {
            console.error("ERROR urlsM setURLsBatchDefault\n", error);
            return 503;
        }
    }

    /**
     * Retrieves the first URL from the `urls` table in the database.
     * The retrieved URL has a `trys` property initialized to 0.
     *
     * @returns {Promise<Array<Object>>} Resolves with an array of URL objects, each having a `trys` property set to 0.
     * If an error occurs, it returns an empty array.
     */
    static async getFirstURL() {
        try {
            const result = await query(`SELECT * FROM public.urls LIMIT 1;`);
            if (result.rows.length > 0) {
                result.rows[0].trys = 0;
            }
            return result.rows;
        } catch (error) {
            console.error("Error al recuperar la primera URL", error);
            throw new Error(error);
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
            const result =
                await query(`SELECT ur.id, ur.url, us.name AS user_name 
                            FROM urls ur
                            INNER JOIN users us ON ur.user_id = us.id;
            `);
            return result.rows;
        } catch (error) {
            console.error("Error al recuperar URLs", error);
            throw new Error(error);
        }
    }

    /**
     * Deletes a URL record from the `urls` table based on its ID.
     *
     * @param {number} id - The ID of the URL to be deleted.
     * @returns {Promise<boolean>} Resolves with `true` if the URL was successfully deleted, or `false` if an error occurred.
     */
    static async deleteURL(id) {
        try {
            await query(`DELETE FROM urls WHERE id = $1;`, id);
            return true;
        } catch (error) {
            console.error("Error al eliminar la URL", error);
            return false;
        }
    }

    /**
     * Deletes multiple URLs from the `urls` table based on an array of URL IDs.
     *
     * @param {number[]} ids - An array of URL IDs to be deleted.
     * @returns {Promise<boolean>} Resolves with `true` if the deletion was successful, otherwise returns `false`.
     */
    static async deleteURLs(ids) {
        const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
        try {
            await query(`DELETE FROM urls WHERE id IN (${placeholders});`, ids);
            return true;
        } catch (error) {
            console.error("Error al eliminar las URLs", error);
            return false;
        }
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
