import Category from "../models/categoryM.js";

/**
 * Recupera todas las categorias y las devuelve en la respuesta.
 *
 * @param {object} req - La entrada HTTP.
 * @param {object} res - La respuesta HTTP.
 * @param {function} next - La función de middleware siguiente.
 * @return {json} Un JSON con las categorias.
 */
const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.getCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
        next(error);
    }
};
/**
 * Envia los datos de una categoria a la base de datos.
 *
 * @param {object} req - La entrada HTTP.
 * @param {object} res - La respuesta HTTP.
 * @param {function} next - La función de middleware siguiente.
 * @return {json} Un JSON con las categorias.
 */
const addCategory = async (req, res, next) => {
    try {
        const category = await Category.postCategory(req.body.data);
        res.sendStatus(200);
    } catch (error) {
        if (error.code == "ECONNREFUSED")
            res.status(503).json({ message: error.message });
        else {
            if (error.code == 23505) {
                res.status(409).json({ message: error.message });
            } else res.status(500).json({ message: error.message });
        }
        next(error);
    }
};
export { getAllCategories, addCategory };
