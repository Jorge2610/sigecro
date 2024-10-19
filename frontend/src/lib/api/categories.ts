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

const getUsedCategories = async () => {
    const response = await axios.get<CategoryType[]>("/api/categories/filters");
    return response.data;
};

export { createCategory, getCategories, getUsedCategories };
