import NewsForm from "@/components/noticias/manual/NewsForm";
import NewsHelper from "@/components/noticias/NewsHelper";
import React from "react";
import { Head } from "@/components/ui/headings";
import { getCategories } from "@/lib/api/categories";
import { ServerErrorPage } from "@/components/ui/error-page";

const helps = [
    "Llena los campos solicitados en el formulario para registrar una noticia.",
];

const Manual = async () => {
    try {
        const categories = await getCategories();
        return (
            <>
                <Head>Formulario</Head>
                <NewsHelper title="Registro manual" helps={helps} />
                <NewsForm categories={categories} />
            </>
        );
    } catch (error) {
        return <ServerErrorPage />;
    }
};

export default Manual;
