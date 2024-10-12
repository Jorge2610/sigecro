import axios from "axios";

const createNews = async (formData: FormData) => {
    const response = await axios.post(`/api/news`, formData);
    return response;
};

export { createNews };
