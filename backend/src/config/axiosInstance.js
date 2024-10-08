import axios from "axios";
import http from "http";
import https from "https";

const httpAgent = new http.Agent({ keepAlive: false });
const httpsAgent = new https.Agent({ keepAlive: false });

const axiosInstance = axios.create({
    httpAgent,
    httpsAgent,
});

export default axiosInstance;
