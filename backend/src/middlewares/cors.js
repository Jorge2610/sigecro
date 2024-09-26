import cors from "cors";

const corsMiddleware = () => {
    const corsOptions = {
        origin: process.env.APP_HOST,
        methods: "GET,POST,PUT,DELETE,PATCH",
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        optionsSuccessStatus: 204,
    };
    return cors(corsOptions);
};

export { corsMiddleware };
