import { query } from "../config/db.js";
class News {
  static async create(data) {
    const res = await query(
      `INSERT INTO news(title, content, date, source, url, summary, image_url, status, category_id, user_id)
       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      data
    );
    return res.rows;
  }
}

export { News };
