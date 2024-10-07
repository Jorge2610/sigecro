import { query } from "../config/db.js";
class Category {
    /**
     * Retrieves a list of categories from the database.
     *
     * @return {Promise<object[]>} An array of objects representing the categories.
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
     * @param {object} data - An object containing the category's name and description.
     * @return {object} The result of the database query.
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
