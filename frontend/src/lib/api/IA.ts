import axios from "axios";
import { capitalizeWords } from "../stringsUtil";

const generateSummary = async (text: string) => {
    const summary = await axios.post("/api/news/summary", { content: text });
    return summary.data;
};

const generateTags = async (text: string) => {
    const tags = await axios.post("/api/news/tags", { content: text });
    tags.data.forEach((tag: string, index: number) => {
        tags.data[index] = capitalizeWords(tag);
    });
    return tags.data;
};

export { generateSummary, generateTags };
