import Category from "../models/categoryM.js";

/**
 * Retrieves all categories from the database.
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.getCategories();
        res.json(categories);
    } catch (error) {
        console.error("ERROR ON category.getAllCategories");
        res.sendStatus(500);
    }
};

/**
 * Retrieves a list of categories used in news articles.
 *
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
const getCategoriesUsed = async (req, res) => {
    try {
        const categories = await Category.getCategoriesUsed();
        res.json(categories);
    } catch (error) {
        console.error("ERROR ON category.getCategoriesUsed");
        res.sendStatus(500);
    }
};

/**
 * Adds a new category to the database.
 *
 * @async
 * @param {Request} req - Express request object containing the category data in req.body.data.
 * @param {Response} res - Express response object.
 */
const addCategory = async (req, res) => {
    try {
        await Category.postCategory(req.body.data);
        res.sendStatus(201);
    } catch (error) {
        console.error("ERROR ON category.getAllCategories");
        error.code === "23505" ? res.sendStatus(409) : res.sendStatus(500);
    }
};
export { getAllCategories, getCategoriesUsed, addCategory };
