import { query, pool } from "../src/config/db.js";

describe("Db Connection", () => {
  afterAll(async () => {
    await pool.end();
  });
  test("should connect to database", async () => {
    const res = await query("SELECT NOW()", []);
    expect(res).toBeDefined();
    expect(res.rows).toBeDefined();
    expect(res.rows.length).toBeGreaterThan(0);
  });
});
