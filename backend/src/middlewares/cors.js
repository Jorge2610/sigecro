import cors from "cors";

/**
 * Creates a CORS middleware function.
 *
 * @returns {Function} A CORS middleware function that can be used in Express applications.
 */
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
