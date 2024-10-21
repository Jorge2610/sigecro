import api from "@/services/apiConfig";
import axios from "axios";

const getPendignUrl = async () => {
    const response = await api.get("/news/scraping/batch");
    return response.data;
};

const deletePendingUrl = async (data: {}) => {
    const response = await axios.delete("/api/news/scraping/batch", data);
    return response.data;
};

export { getPendignUrl, deletePendingUrl };
