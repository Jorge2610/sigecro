import cors from "cors";

const corsOptions = {
  origin: [process.env.APP_HOST],
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export const corsMiddleware = () => cors(corsOptions);