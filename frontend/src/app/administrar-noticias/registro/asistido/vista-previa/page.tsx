"use client";

import NewsHelper from "@/components/noticias/NewsHelper";
import { useContext, useState } from "react";
import { AssistedRecordContext } from "@/store/AssitedRecordProvider";
import { PageNotFound } from "@/components/ui/error-page";
import NewsView from "@/components/ui/news-view";
import AssistedRecordForm from "@/components/noticias/assisted/AssistedRecordForm";
import { Separator } from "@/components/ui/separator";

const helps = [
    "Revisa la información extraida.",
    "Completa los campos restantes.",
    'Haz clic en "Publicar" para finalizar.',
];

const AssistedPreviewPage = () => {
    const { newsData } = useContext(AssistedRecordContext);
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
            <AssistedRecordForm
                newsData={newsData}
                setImageUrl={handleImageUrl}
            />
        </>
    ) : (
        <PageNotFound />
    );
};

export default AssistedPreviewPage;
