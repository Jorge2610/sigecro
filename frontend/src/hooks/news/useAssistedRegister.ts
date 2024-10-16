import { getNewsByScraping } from "@/lib/api/scraping";
import { NewsData } from "@/types/newsType";
import { useRouter } from "next/navigation";
import { useHandleToast } from "../useHandleToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    formAsssistedRegisterUrl,
    assistedRegisterUrlSchema,
    formAsssistedRecord,
    assistedRecordSchema,
} from "@/types/registerSchemas";
import { CategoryType } from "@/types/categoryType";
import { useNewsDataContext } from "@/store/NewsDataProvider";

const MESSAGE_ERROR = "No se pudo extraer la noticia.";

const useAssistedRegister = (categories?: CategoryType[]) => {
    const { updateNewsData } = useNewsDataContext();
    const router = useRouter();
    const { showToast } = useHandleToast();
    const formUrl = useForm<formAsssistedRegisterUrl>({
        resolver: zodResolver(assistedRegisterUrlSchema),
        defaultValues: {
            url: "",
            category: categories && categories[0],
        },
    });

    const formPreview = useForm<formAsssistedRecord>({
        resolver: zodResolver(assistedRecordSchema),
        defaultValues: {
            summary: "",
            image: undefined,
            tags: [],
        },
    });

    const handleScrapingNews = async () => {
        try {
            const response = await getNewsByScraping(formUrl.getValues().url);
            formatResponse(response);
        } catch (error) {
            showToast("error", MESSAGE_ERROR);
        }
    };

    const formatResponse = (response: any): void => {
        const newsData: NewsData = {
            url: response.url,
            title: response.title,
            date: new Date(response.dateTime),
            source: response.source,
            content: response.content,
            category_id: formUrl.getValues().category.id,
            category_name: formUrl.getValues().category.name,
            status: "",
            summary: "",
            user_id: "",
            tags: [],
        };
        updateNewsData(newsData);
        router.push("/administrar-noticias/registro/asistido/vista-previa");
    };

    return { formUrl, formPreview, handleScrapingNews };
};

export { useAssistedRegister };
