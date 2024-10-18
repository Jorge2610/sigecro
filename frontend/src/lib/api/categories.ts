import api from "@/services/apiConfig";
import { CategoryType } from "@/types/categoryType";
import axios from "axios";

const createCategory = async (category: CategoryType) => {
    const response = await axios.post(`/api/categories`, { data: category });
    return response.data;
};

const getCategories = async () => {
    const response = await api.get(`/categories`);
    return response.data.rows as CategoryType[];
};

export { createCategory, getCategories };
