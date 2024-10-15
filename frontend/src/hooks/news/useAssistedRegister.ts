import { getNewsByScraping } from "@/lib/api/scraping";
import { useContext } from "react";
import { AssistedRecordContext } from "@/store/AssitedRecordProvider";
import { AssistedRecordNews } from "@/types/newsType";
import { useRouter } from "next/navigation";
import { useHandleToast } from "../useHandleToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    formAsssistedRegisterUrl,
    assistedRegisterUrlSchema,
} from "@/types/registerSchemas";

const MESSAGE_ERROR = "No se pudo extraer la noticia.";

const useAssistedRegister = () => {
    const { categories, setNewsData } = useContext(AssistedRecordContext);
    const router = useRouter();
    const { showToast } = useHandleToast();
    const form = useForm<formAsssistedRegisterUrl>({
        resolver: zodResolver(assistedRegisterUrlSchema),
        defaultValues: {
            url: "",
            category_id: categories && categories[0].id,
        },
    });

    const handleScrapingNews = async () => {
        try {
            const response = await getNewsByScraping(form.getValues().url);
            updateNewsData(response);
        } catch (error) {
            showToast("error", MESSAGE_ERROR);
        }
    };

    const updateNewsData = (response: any): void => {
        const newsData: AssistedRecordNews = {
            url: response.url,
            title: response.title,
            date: new Date(response.dateTime),
            source: response.source,
            content: response.content,
            category_id: form.getValues().category_id,
        };
        setNewsData(newsData);
        router.push("/administrar-noticias/registro/asistido/vista-previa");
    };

    return { form, handleScrapingNews };
};

export { useAssistedRegister };
