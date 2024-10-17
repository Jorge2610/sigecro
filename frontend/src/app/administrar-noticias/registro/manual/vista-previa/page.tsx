"use client";

import NewsView from "@/components/ui/news-view";
import { NewsViewType } from "@/types/newsType";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Popup } from "@/components/ui/popup";
import { popupPublic } from "@/data/newsMessages";
import { useNews } from "@/hooks/useNews";
import { formatNewsDataToNewsView } from "@/lib/formUtils";
import { useNewsDataContext } from "@/store/NewsDataProvider";
import { PageNotFound } from "@/components/ui/error-page";

const ManualPreviewPage = () => {
    const { newsData } = useNewsDataContext();
    const { submitData } = useNews(newsData);
    const imageUrl = newsData.image && URL.createObjectURL(newsData.image);
    const newsViewData: NewsViewType = formatNewsDataToNewsView(
        newsData,
        false,
        imageUrl
    );

    return newsData.title ? (
        <>
            <NewsView newsData={newsViewData} />
            <ActionButtons submitData={submitData} />
        </>
    ) : (
        <PageNotFound />
    );
};

const ActionButtons = ({ submitData }: { submitData: () => Promise<void> }) => {
    return (
        <div className="flex flex-row justify-end gap-4">
            <Button asChild variant="outline">
                <Link href="/administrar-noticias/registro/manual">
                    Atrás
                </Link>
            </Button>
            <Popup
                title={popupPublic.title}
                description={popupPublic.description}
                action={submitData}
            >
                <Button>Publicar</Button>
            </Popup>
        </div>
    );
};

export default ManualPreviewPage;
