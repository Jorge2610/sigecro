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

export { getAllCategories };
