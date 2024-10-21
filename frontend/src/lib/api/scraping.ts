import axios from "axios";

const getNewsByScraping = async (url: string) => {
    const response = await axios.post("/api/news/scraping", {
        url: url,
    });
    return response.data;
};

const createBatchUrl = async (
    urls: string,
    user_id: number,
    category_id: string
) => {
    await axios.post("/api/news/scraping/batch", {
        urls: urls,
        user_id: user_id,
        category_id: category_id,
    });
};

export { getNewsByScraping, createBatchUrl };
