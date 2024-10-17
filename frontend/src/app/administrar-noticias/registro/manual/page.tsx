import NewsForm from "@/components/noticias/manual/ManualRegisterForm";
import NewsHelper from "@/components/noticias/NewsHelper";
import React from "react";
import { Head } from "@/components/ui/headings";
import { getCategories } from "@/lib/api/categories";

const helps = [
    "Llena los campos solicitados en el formulario para registrar una noticia.",
];

const ManualPage = async () => {
    const categories = await getCategories();
    return (
        <>
            <Head>Formulario</Head>
            <NewsHelper title="Registro manual" helps={helps} />
            <NewsForm categories={categories} />
        </>
    );
};

export default ManualPage;
