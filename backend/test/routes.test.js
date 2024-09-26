import request from "supertest";
import app from "../src/app";
import { pool } from "../src/config/db";

afterAll(async () => {
    await pool.end();
});

describe("GET /permissions", () => {
    test("should respond with a 200 status code", async () => {
        const response = await request(app).get("/api/permissions").send();
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(27);
    });
});

describe("GET /categories", () => {
    test("should respond with a 200 status code", async () => {
        const response = await request(app).get("/api/categories").send();
        expect(response.statusCode).toBe(200);
    });

    test("should respond with one row of categories", async () => {
        const response = await request(app).get("/api/categories").send();
        expect(response.body.rows.length).toBeGreaterThan(0);
    });
});

describe("POST /news/scraping", () => {
    test("should respond with a 200 status code and a json with the scraping data", async () => {
        const response = await request(app).post("/api/news/scraping").send({
            url: "https://www.lostiempos.com/actualidad/pais/20240826/tse-preve-entregar-alp-ley-distribucion-escanos-mediados-septiembre",
        });
        expect(response.body.source).not.toBe("");
        expect(response.body.url).not.toBe("");
        expect(response.statusCode).toBe(200);
    });

    test("should respond with a 503 status code if there is no connection to the provide url", async () => {
        const response = await request(app).post("/api/news/scraping").send({
            url: "https://www.lostiemposx.com/actualidad/pais/20240826/tse-preve-entregar-alp-ley-distribucion-escanos-mediados-septiembre",
        });
        expect(response.statusCode).toBe(503);
    });
});

describe("POST /categories", () => {
    const name = "name" + Math.random();
    test("should respond with a 200 status code", async () => {
        const response = await request(app)
            .post("/api/categories")
            .send({
                data: { name: name, description: "" },
            });
        expect(response.statusCode).toBe(200);
    });
    test("should respond with a 409 status code", async () => {
        const response = await request(app)
            .post("/api/categories")
            .send({
                data: { name: name, description: "" },
            });
        expect(response.statusCode).toBe(409);
    });
});

describe("POST /news/scraping/batch", () => {
    test("should respond with a 200 status if everything its ok.", async () => {
        const response = await request(app)
            .post("/api/news/scraping/batch")
            .send({
                urls: "https://www.lostiempos.com/actualidad/pais/20240826/tse-preve-entregar-alp-ley-distribucion-escanos-mediados-septiembre\nhttps://www.lostiempos.com/actualidad/economia/20240918/temen-que-bloqueos-impidan-llegar-us-10-mil-millones-exportaciones\nhttps://www.lostiempos.com/actualidad/pais/20240918/del-castillo-advierte-procesar-evo-impulsar-golpe-estado",
                user_id: 1,
                category_id: 1,
            });
        expect(response.statusCode).toBe(200);
    });

    test("should respond with a 503 status code if the URLs are empty.", async () => {
        const response = await request(app)
            .post("/api/news/scraping/batch")
            .send({
                urls: "",
                user_id: 1,
            });
        expect(response.statusCode).toBe(503);
    });
});

describe("GET /news/scraping/batch", () => {
    test("should respond with a 200 status if everything its ok.", async () => {
        const response = await request(app).get("/api/news/scraping/batch");
        expect(response.statusCode).toBe(200);
    });
});

describe("DELETE /news/scraping/batch", () => {
    test("should respond with a 204 status if everything its ok.", async () => {
        const response = await request(app).delete("/api/news/scraping/batch", {
            data: { ids: [1, 2, 3] },
        });
        expect(response.statusCode).toBe(204);
    });
});
