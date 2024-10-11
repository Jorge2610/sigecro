import { postScraping } from "@/lib/api/scraping";
import { NewsData } from "@/types/newsType";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { SetStateAction, Dispatch, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    formAsssistedRegister,
    assistedRegisterFormSchema,
} from "@/types/registerType";
import { CategoryType } from "@/types/categoryType";

const useExtractNews = (
    categories: CategoryType[] | undefined,
    setNewsData: Dispatch<SetStateAction<NewsData>>
) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<formAsssistedRegister>({
        resolver: zodResolver(assistedRegisterFormSchema),
        defaultValues: {
            url: "",
            category_id: categories && categories[0],
        },
    });

    /**
     * Extracts news data from a given URL and redirects to the preview page if successful.
     */
    const handleExtractNews = async () => {
        setLoading(true);
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
        setLoading(false);
    };

    const updateNewsData = (response: any): void => {
        const newsData: NewsData = {
            url: response.url,
            title: response.title,
            dateTime: new Date(response.dateTime),
            source: response.source,
            content: response.content,
            category_id: form.getValues().category_id.id,
        };
        setNewsData(newsData);
        router.push("/administrar-noticias/registro/asistido/vista-previa");
    };

    return { form, handleExtractNews, loading };
};

export { useExtractNews };
