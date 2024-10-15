import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    formAsssistedRecord,
    assistedRecordSchema,
} from "@/types/registerSchemas";
import { useRouter } from "next/navigation";
import { createNews } from "@/lib/api/news";
import { AssistedRecordNews } from "@/types/newsType";
import { sub } from "date-fns";
import { useHandleToast } from "./useHandleToast";

const useNews = (newsData: AssistedRecordNews) => {
    const router = useRouter();
    const { showToast } = useHandleToast();
    const form = useForm<formAsssistedRecord>({
        resolver: zodResolver(assistedRecordSchema),
        defaultValues: {
            summary: "",
            image: undefined,
            tags: [],
        },
    });

    const submitData = async (): Promise<void> => {
        try {
            const formData = getFormData(form.getValues());
            await createNews(formData);
            router.push("/administrar-noticias");
            showToast("success");
        } catch (error) {
            showToast("error");
        }
    };

    const getFormData = (data: formAsssistedRecord): FormData => {
        const formData = new FormData();
        formData.append("title", newsData.title);
        formData.append("content", getFormatedContent(newsData.content));
        formData.append("date", sub(newsData.date, { hours: 4 }).toISOString());
        formData.append("source", newsData.source);
        formData.append("url", newsData.url ?? "");
        formData.append("summary", data.summary);
        data.image && formData.append("image", data.image);
        formData.append("status", "published");
        data.tags && formData.append("tags", JSON.stringify(data.tags));
        formData.append("category_id", newsData.category_id);
        formData.append("user_id", "1");
        return formData;
    };

    const getFormatedContent = (content: Array<string>): string => {
        let formatedContent: string = "";
        for (const paragraph of content) {
            formatedContent += paragraph + "\n";
        }
        return formatedContent;
    };

    return { form, submitData };
};

export { useNews };
