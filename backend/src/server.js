import app from "./app.js";
import startScheduledJobs from "./utils/scheduler.js";

startScheduledJobs();

const PORT = process.env.API_PORT;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
