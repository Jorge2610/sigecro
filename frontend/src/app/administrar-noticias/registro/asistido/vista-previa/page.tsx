"use client";

import NewsHelper from "@/components/noticias/NewsHelper";
import { useState } from "react";
import { PageNotFound } from "@/components/ui/error-page";
import NewsView from "@/components/ui/news-view";
import AssistedRecordForm from "@/components/noticias/assisted/AssistedRegisterForm";
import { Separator } from "@/components/ui/separator";
import { useNewsDataContext } from "@/store/NewsDataProvider";
import { formatNewsDataToNewsView } from "@/lib/formUtils";

const helps = [
    "Revisa la información extraida.",
    "Completa los campos restantes.",
    'Haz clic en "Publicar" para finalizar.',
];

const AssistedPreviewPage = () => {
    const { newsData } = useNewsDataContext();
    const [imageUrl, setImageUrl] = useState<string>("");

    const handleImageUrl = (imageUrl: string): void => {
        setImageUrl((_) => imageUrl);
    };

    return newsData.title ? (
        <>
            <NewsHelper title="Registro asistido" helps={helps} />
            <NewsView
                newsData={formatNewsDataToNewsView(newsData, true, imageUrl)}
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
