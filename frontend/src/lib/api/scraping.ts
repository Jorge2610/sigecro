import axios from "axios";

const postScraping = async (url: string) => {
    const response = await axios.post("/api/news/scraping", {
        url: url,
    });
    return response.data;
};

export { postScraping };
