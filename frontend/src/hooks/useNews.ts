import { useRouter } from "next/navigation";
import { createNews } from "@/lib/api/news";
import { NewsData } from "@/types/newsType";
import { sub } from "date-fns";
import { useHandleToast } from "./useHandleToast";
import { getFormatedContent } from "@/lib/stringsUtil";

const useNews = (newsData: NewsData) => {
    const router = useRouter();
    const { showToast } = useHandleToast();

    const submitData = async (): Promise<void> => {
        try {
            const formData = getFormData();
            await createNews(formData);
            router.push("/administrar-noticias");
            showToast("success");
        } catch (error) {
            showToast("error");
        }
    };

    const getFormData = (): FormData => {
        const formData = new FormData();
        formData.append("title", newsData.title);
        formData.append("content", getFormatedContent(newsData.content));
        formData.append("date", sub(newsData.date, { hours: 4 }).toISOString());
        formData.append("source", newsData.source);
        formData.append("url", newsData.url ?? "");
        formData.append("summary", newsData.summary);
        newsData.image && formData.append("image", newsData.image);
        formData.append("status", "published");
        newsData.tags && formData.append("tags", JSON.stringify(newsData.tags));
        formData.append("category_id", newsData.category_id);
        formData.append("user_id", "1");
        return formData;
    };

    return { submitData };
};

export { useNews };
