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

const useManualRegister = (categories: CategoryType[]) => {
    const { updateNewsData, newsData } = useNewsDataContext();
    const router = useRouter();

    const defaultFormValues = {
        title: newsData.title,
        content: getFormatedContent(newsData.content),
        date:
            newsData.date.getUTCFullYear() === 2000 ? undefined : newsData.date,
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

    const showPreview = (data: formManualRegister): void => {
        data.source = capitalizeWords(data.source);
        updateNewsData(manualFormToNewsData(newsData, data));
        router.push("/administrar-noticias/registro/manual/vista-previa");
    };

    return { form, showPreview };
};

export { useManualRegister };
