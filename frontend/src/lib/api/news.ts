import api from "@/services/apiConfig";
import axios from "axios";
import { News, NewsViewType } from "@/types/newsType";
import { splitIntoParagraphs } from "../stringsUtil";
const createNews = async (formData: FormData) => {
    const response = await axios.post(`/api/news`, formData);
    return response;
};

const getNews = async (id: string) => {
    const response = await api.get(`/news/${id}`);
    const news = formatNews(response.data.data[0]);
    return news;
};

const getSourcesNews = async () => {
    const response = await axios.get("/api/news/sources");
    return response.data;
};

const getNewsBySearch = async (params = {}) => {
    const response = await axios.get("/api/news/searching", {
        params,
    });
    console.log(response.data);
    return response.data as News[];
};

const formatNews = (newsData: any) => {
    const news: NewsViewType = {
        content: splitIntoParagraphs(newsData.content),
        date: newsData.date,
        source: newsData.source,
        title: newsData.title,
        category_name: newsData.category_name,
        tags: newsData.tags[0] !== null ? newsData.tags : undefined,
        url: newsData.url,
    };
    return news;
};

export { createNews, getNews, getSourcesNews, getNewsBySearch };
