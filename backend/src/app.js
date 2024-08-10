import express, { json, urlencoded } from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import morgan from "morgan";
const app = express();
import routes from "./routes/index.js";

// Configuraciones
app.disable("x-powered-by");
app.use(morgan("dev"));

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(corsMiddleware());
app.options("*", corsMiddleware());

// Rutas
app.use("/api", routes);

// Manejo de errores
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;
