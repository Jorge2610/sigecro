"use client";

import NewsHelper from "@/components/noticias/NewsHelper";
import { useContext, useState } from "react";
import { AutomaticContext } from "@/store/AssitedRecordNewsProvider";
import { PageNotFound } from "@/components/ui/error-page";
import NewsView from "@/components/ui/news-view";
import AssistedForm from "@/components/noticias/automatico/AssistedForm";
import { Separator } from "@/components/ui/separator";

const helps = [
    "Revisa la información extraida.",
    "Completa los campos restantes.",
    'Haz clic en "Publicar" para finalizar.',
];

const VistaPrevia = () => {
    const { newsData } = useContext(AutomaticContext);
    const [imageUrl, setImageUrl] = useState<string>("");

    const handleImageUrl = (imageUrl: string): void => {
        setImageUrl((_) => imageUrl);
    };


    return newsData.title ? (
        <>
            <NewsHelper title="Registro asistido" helps={helps} />
            <NewsView
                title={newsData.title}
                url={newsData.url}
                content={newsData.content}
                dateTime={newsData.date}
                source={newsData.source}
                imageUrl={imageUrl}
            />
            <Separator />
            <AssistedForm newsData={newsData} setImageUrl={handleImageUrl} />
        </>
    ) : (
        <PageNotFound />
    );
};

export default VistaPrevia;
