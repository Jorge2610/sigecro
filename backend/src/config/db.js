import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

/**
 * Executes a PostgreSQL query asynchronously and logs its execution time.
 *
 * @async
 * @param {string} query - The PostgreSQL query string to be executed.
 * @param {Array} [params] - An optional array of parameters to be substituted into the query.
 * @returns {Promise<QueryResult>} A Promise that resolves to a QueryResult object containing the query results.
 * @throws {Error} Throws an error if there's an issue executing the query, such as a connection error or a syntax error.
 */
const query = async (query, params) => {
    //const start = Date.now();
    try {
        const res = await pool.query(query, params);
        //const duration = Date.now() - start;
        //console.log("executed query", { query, duration, rows: res.rowCount });
        return res;
    } catch (err) {
        console.error("QUERY/CONN ERROR ON db.query:\n", { query, err });
        throw err;
    }
};

export { query };
