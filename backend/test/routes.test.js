import request from "supertest";
import app from "../src/app";
import { pool } from "../src/config/db"; // Importa el pool de conexiones

afterAll(async () => {
  await pool.end(); // Cierra el pool de conexiones de PostgreSQL
});

describe("GET /permissions", () => {
  test("should respond with a 200 status code", async () => {
    const response = await request(app).get("/api/permissions").send();
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(27);
  });
});
