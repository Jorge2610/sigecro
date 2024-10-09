import { postScraping } from "@/lib/api/scraping";
import { NewsData } from "@/types/newsType";
import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { formAsssistedReister } from "@/types/registerType";

const useExtractNews = (
    form: UseFormReturn<formAsssistedReister>,
    setExtracting: (value: boolean) => void,
    setNewsData: (value: NewsData) => void
) => {
    const router = useRouter();
    const { toast } = useToast();
    
    /**
     * Extracts news data from a given URL and redirects to the preview page if successful.
     * 
     * @param {formAsssistedReister} values - The form values containing the URL and category to extract the news from.
     */
    const handleExtractNews = async (values: formAsssistedReister) => {
        setExtracting(true);
        try {
            const response = await postScraping(values);
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
        } catch (error) {
            toast({
                title: "Error",
                description: "Error",
                variant: "destructive",
            });
        }
        setExtracting(false);
    };
    return handleExtractNews;
};

export { useExtractNews };
