import app from "./app.js";
import dotenv from "dotenv";
import schedule from "node-schedule";
import workerPool from "./utils/workers/WorkerPool.js";
dotenv.config();

schedule.scheduleJob("0 1 * * *", () => {
    workerPool.run("programmedRecord");
});

const PORT = process.env.API_PORT;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
