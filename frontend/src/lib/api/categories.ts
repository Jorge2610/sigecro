import api from "@/services/apiConfig";
import { CategoryType } from "@/types/categoryType";

const getCategories = async () => {
    const response = await api.get(`/categories`);
    return response.data.rows as CategoryType[];
};

export { getCategories };
