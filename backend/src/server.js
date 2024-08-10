import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.API_PORT;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
