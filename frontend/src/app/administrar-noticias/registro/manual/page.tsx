"use client";
import NewsForm from "@/components/noticias/manual/NewsForm";
import axios from "axios";
import { useEffect, useState } from "react";
import NewsHelper from "@/components/noticias/NewsHelper";
import React from "react";

const helps = [
    "Llena los campos solicitados en el formulario para registrar una noticia.",
];

interface Category {
    id: number;
    name: string;
}
const Manual = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        getCategories();
    }, []);

    /**
     * Retrieves a list of categories from the API and updates the component's state.
     *
     * @return {Promise<void>} A promise that resolves when the categories have been fetched and the state has been updated.
     */
    const getCategories = async (): Promise<void> => {
        try {
            const resp = await axios.get("/api/categories");
            if (resp.status === 200) {
                setCategories(resp.data);
            }
        } catch (error) {}
    };

    return (
        categories.length > 0 && (
            <>
                <NewsHelper title="Registro manual" helps={helps} />
                <NewsForm categories={categories} />
            </>
        )
    );
};

export default Manual;
