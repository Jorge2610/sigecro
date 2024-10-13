import { postScraping } from "@/lib/api/scraping";
import { useContext } from "react";
import { AssistedRecordContext } from "@/store/AssitedRecordProvider";
import { AssistedRecordNews } from "@/types/newsType";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    formAsssistedRegisterUrl,
    assistedRegisterUrlSchema,
} from "@/types/registerType";

const useScrapingNews = () => {
    const { categories, setNewsData } = useContext(AssistedRecordContext);
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<formAsssistedRegisterUrl>({
        resolver: zodResolver(assistedRegisterUrlSchema),
        defaultValues: {
            url: "",
            category_id: categories && categories[0],
        },
    });

    /**
     * Extracts news data from a given URL and redirects to the preview page if successful.
     */
    const handleScrapingNews = async () => {
        try {
            const response = await postScraping(form.getValues().url);
            updateNewsData(response);
        } catch (error) {
            toast({
                title: "Extracción fallida",
                description: "No se pudo extraer la noticia.",
                variant: "destructive",
            });
        }
    };

    const updateNewsData = (response: any): void => {
        const newsData: AssistedRecordNews = {
            url: response.url,
            title: response.title,
            date: new Date(response.dateTime),
            source: response.source,
            content: response.content,
            category_id: form.getValues().category_id.id,
        };
        setNewsData(newsData);
        router.push("/administrar-noticias/registro/asistido/vista-previa");
    };

    return { form, handleScrapingNews };
};

export { useScrapingNews };
