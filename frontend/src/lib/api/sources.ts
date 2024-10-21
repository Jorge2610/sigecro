import api from "@/services/apiConfig";

const getSources = async () => {
    const response = await api.get("/news/sources");
    return response.data;
};

export { getSources };
