import { query } from "../config/db.js";
class Category {
  /**
   * Recupera una lista de categorias desde la base de datos.
   *
   * @return {object[]} Un arreglo de objetos que representan las categorias.
   */
  static async getCategories() {
    const res = await query("SELECT id, name FROM categories;", []);
    return res;
  }
}

export default Category;
