import { query } from "../config/db.js";

class Category {
    /**
     * Retrieves a list of all categories from the database.
     *
     * @returns {Promise<QueryResult>} A Promise that resolves to a QueryResult object containing the list of categories.
     */
    static async getCategories() {
        const res = await query("SELECT id, name FROM public.categories;", []);
        return res;
    }

    static async getCategoriesUsed() {
        const res = await query(
            `SELECT c.id, c.name
            FROM categories c
            JOIN news n ON c.id = n.category_id
            GROUP BY
            c.name, c.id
            ORDER BY c.name DESC;`,
            []
        );
        return res;
    }

    /**
     * Creates a new category in the database.
     *
     * @param {object} data - An object containing the category data (name, description).
     * @returns {Promise<QueryResult>} A Promise that resolves to a QueryResult object containing the newly created category.
     */
    static async postCategory(data) {
        const res = await query(
            "INSERT INTO categories(name,description) values ($1,$2);",
            [data.name, data.description]
        );
        return res;
    }
}

export default Category;
