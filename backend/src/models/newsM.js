import { query } from "../config/db.js";

class News {
    /**
     * Crea una nueva noticia en la base de datos.
     *
     * @param {object}  data - Un objeto que contiene los datos de la noticia que será insertada.
     * @return {array} Una promesa que resuelve con el resultado de la consulta.
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
     * Guarda las etiquetas de una noticia en la base de datos.
     *
     * @param {object} tags - Un objeto que contiene las etiquetas de la noticia.
     * @return {array}  Un arreglo de campos provistos por la consulta.
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
