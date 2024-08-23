import { query } from "../config/db.js";
class News {
  /*
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
  static async setTags(tags) {
    const res = await query("call insert_tags($1, $2)", tags);
    return res.rows;
  }
}

export { News };
