import { query, pool } from "../config/db.js";

describe("Db test", () => {
  /**
   * It is a test that ensures that the pool is defined.
   * @return {Promise<void>} It does not return anything.
   */
  afterAll(async () => {
    await pool.end();
  });

  /**
   * It is a test that ensures that the application can connect to the database.
   * @return {Promise<void>} It does not return anything.
   */
  test("should connect to database", async () => {
    const res = await query("SELECT NOW()", []);
    expect(res).toBeDefined();
    expect(res.rows).toBeDefined();
    expect(res.rows.length).toBeGreaterThan(0);
  });
});
