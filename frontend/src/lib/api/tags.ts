import axios from "axios";

const getMostUsedTags = async () => {
    const response = await axios.get(
        "/api/news/tags/filters"
    );
    return response.data;
};

export { getMostUsedTags };
