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
    console.log(response.body.message);
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
      title:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempor elit eu quam fringilla consequat. Curabitur tempor rhoncus tempor. Nunc at lorem luctus, mattis quam in, mollis massa. Suspendisse sit amet lorem erat. Phasellus nulla dolor, rhoncus id eros nec, vulputate elementum dui. Vestibulum nec luctus purus. Nulla facilisi. Duis vel massa mauris.",
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
