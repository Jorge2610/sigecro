import axios from "axios";
import { capitalizeWords } from "../stringsUtil";

const generateSummary = async (text: string) => {
    const summary = await axios.get("/api/news/summary", {
        params: { text: text },
    });
    return summary.data;
};

const generateTags = async (text: string) => {
    const tags = await axios.get("/api/news/tags", {
        params: { text: text },
    });
    tags.data.forEach((tag: string, index: number) => {
        tags.data[index] = capitalizeWords(tag);
    });
    return tags.data;
};

export { generateSummary, generateTags };
