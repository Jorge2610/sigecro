import axios from "axios";

const postScraping = async (values: any) => {
        const response = await axios.post("/api/news/scraping", {
            url: values.url,
        });
        return response.data; 
};

export { postScraping };
