import { zodResolver } from "@hookform/resolvers/zod";
import {
    formManualRegister,
    manualRegisterSchema,
} from "@/types/registerSchemas";
import { useForm } from "react-hook-form";
import { CategoryType } from "@/types/categoryType";
import { capitalizeWords, getFormatedContent } from "@/lib/stringsUtil";
import { useRouter } from "next/navigation";
import { useNewsDataContext } from "@/store/NewsDataProvider";
import { manualFormToNewsData } from "@/lib/formUtils";
import { NewsData } from "@/types/newsType";
import { useEffect } from "react";

const useManualRegister = (categories: CategoryType[]) => {
    const { updateNewsData, resetNewsData, newsData } = useNewsDataContext();
    const router = useRouter();
    const defaultFormValues = {
        title: newsData.title,
        content: getFormatedContent(newsData.content),
        date:
            newsData.date.getUTCFullYear() ===
            new Date("2000-01-01").getUTCFullYear()
                ? undefined
                : newsData.date,
        source: newsData.source,
        url: newsData.url,
        summary: newsData.summary,
        image: newsData.image,
        tags: newsData.tags,
        category: newsData.category_id
            ? { id: newsData.category_id, name: newsData.category_name }
            : categories[0],
    };

    const form = useForm<formManualRegister>({
        resolver: zodResolver(manualRegisterSchema),
        defaultValues: defaultFormValues,
    });

    useEffect(() => {
        form.reset(defaultFormValues);
    }, [newsData, form, categories]);

    const showPreview = (data: formManualRegister): void => {
        data.source = capitalizeWords(data.source);
        updateNewsData(manualFormToNewsData(newsData, data));
        router.push("/administrar-noticias/registro/manual/vista-previa");
    };

    const cleanForm = (): void => {
        resetNewsData();
        //form.reset(defaultFormValues);
    };

    return { form, showPreview, cleanForm };
};

export { useManualRegister };
