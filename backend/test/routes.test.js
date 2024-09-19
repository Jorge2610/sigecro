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

describe("POST /news", () => {
    test("should respond with a 201 status code without image ", async () => {
        const response = await request(app).post("/api/news").send({
            title: "test1",
            content: "test",
            date: new Date(),
            source: "test",
            url: "test",
            summary: "test",
            status: "test",
            category_id: 1,
            user_id: 1,
        });
        console.log(response.body.message);
        expect(response.statusCode).toBe(201);
    });

    test("should respond with a 201 status code with image", async () => {
        const response = await request(app)
            .post("/api/news")
            .field({
                title: "test2",
                content: "test",
                date: new Date().toISOString(),
                source: "test",
                url: "test",
                summary: "test",
                status: "test",
                category_id: 1,
                user_id: 1,
            })
            .attach("image", "test/files/test.jpg");

        console.log(response.body.message);
        expect(response.statusCode).toBe(201);
    });

    test("should show an error for size of image", async () => {
        const response = await request(app)
            .post("/api/news")
            .field({
                title: "test3",
                content: "test",
                date: new Date().toISOString(),
                source: "test",
                url: "test",
                summary: "test",
                status: "test",
                category_id: 1,
                user_id: 1,
            })
            .attach("image", "test/files/test-peso.jpg");
        expect(response.statusCode).toBe(500);
    });

    test("should show an error for type of image", async () => {
        const response = await request(app)
            .post("/api/news")
            .field({
                title: "test4",
                content: "test",
                date: new Date().toISOString(),
                source: "test",
                url: "test",
                summary: "test",
                status: "test",
                category_id: 1,
                user_id: 1,
            })
            .attach("image", "test/files/test-format.bibtex");
        console.log(response.body.message);
        expect(response.statusCode).toBe(500);
    });

    test("should respond with a 500 status code title too long", async () => {
        const response = await request(app).post("/api/news").send({
            title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempor elit eu quam fringilla consequat. Curabitur tempor rhoncus tempor. Nunc at lorem luctus, mattis quam in, mollis massa. Suspendisse sit amet lorem erat. Phasellus nulla dolor, rhoncus id eros nec, vulputate elementum dui. Vestibulum nec luctus purus. Nulla facilisi. Duis vel massa mauris.",
            content: "test",
            date: new Date().toISOString(),
            source: "test",
            url: "test",
            summary: "test",
            status: "test",
            category_id: 1,
            user_id: 1,
        });
        console.log(response.body.message);
        expect(response.statusCode).toBe(500);
    });

    test("should respond with a 500 status code url too long", async () => {
        const response = await request(app).post("/api/news").send({
            title: "test4",
            content: "test",
            date: new Date().toISOString(),
            source: "test",
            url: "https://www.lostiempos.com/actualidad/pais/20240812/presidente-del-senado-dice-que-suspension-primarias-ingresara-comisionhttps://www.lostiempos.com/actualidad/pais/20240812/presidente-del-senado-dice-que-suspension-primarias-ingresara-comisionhttps://www.lostiempos.com/actualidad/pais/20240812/presidente-del-senado-dice-que-suspension-primarias-ingresara-comision",
            summary: "test",
            status: "test",
            category_id: 1,
            user_id: 1,
        });
        console.log(response.body.message);
        expect(response.statusCode).toBe(500);
    });
});

describe("GET /categories", () => {
    test("should respond with a 200 status code", async () => {
        const response = await request(app).get("/api/categories").send();
        console.log(response.body.rows);
        expect(response.statusCode).toBe(200);
    });

    test("should respond with one row of categories", async () => {
        const response = await request(app).get("/api/categories").send();
        console.log(response.body);
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

describe("POST /categories",()=>{
  const name= "name"+ Math.random();
  test("should respond with a 200 status code", async()=>{
    const response = await request(app).post("/api/categories").send({
      data:{name:name,
        description:""}
    });
    expect(response.statusCode).toBe(200);
  })
  test("should respond with a 409 status code", async()=>{
    const response = await request(app).post("/api/categories").send({
      data:{name:name,
        description:""}
    });
    expect(response.statusCode).toBe(409);
  })
})

describe("POST /news/scraping/batch", () => {
    test("should respond with a 200 status if everything its ok.", async () => {
        const response = await request(app).post("/api/news/scraping/batch").send({
            urls: "https://www.lostiempos.com/actualidad/pais/20240826/tse-preve-entregar-alp-ley-distribucion-escanos-mediados-septiembre\nhttps://www.lostiempos.com/actualidad/economia/20240918/temen-que-bloqueos-impidan-llegar-us-10-mil-millones-exportaciones\nhttps://www.lostiempos.com/actualidad/pais/20240918/del-castillo-advierte-procesar-evo-impulsar-golpe-estado",
            user_id: 1
        });
        expect(response.statusCode).toBe(200);
    });

    test("should respond with a 503 status code if the URLs are empty.", async () => {
        const response = await request(app).post("/api/news/scraping/batch").send({
            urls: "",
            user_id: 1
        });
        expect(response.statusCode).toBe(503);
    });
});
