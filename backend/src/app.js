import express, { json, urlencoded } from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes/index.js";
import path from "path";

const app = express();

// Configuraciones
app.disable("x-powered-by");
app.use(morgan("dev"));
app.use(express.static(path.join("./public/")));

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());

// Rutas
app.use("/api", routes);

// Manejo de errores
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;
