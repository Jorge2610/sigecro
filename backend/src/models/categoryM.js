import { query } from "../config/db.js";
class Category {
  /**
   * Recupera una lista de categorias desde la base de datos.
   *
   * @return {object[]} Un arreglo de objetos que representan las categorias.
   */
  static async getCategories() {
    const res = await query("SELECT id, name FROM public.categories;", []);
    return res;
  }
  static async postCategory(data){
    const res= await query("INSERT INTO categories(name,description) values ($1,$2);",[data.name,data.description]);
    return res;
  }
}

export default Category;
