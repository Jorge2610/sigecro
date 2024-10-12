import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    formAsssistedRecord,
    assistedRecordSchema,
} from "@/types/registerType";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { toastMessages } from "@/data/newsMessages";
import { createNews } from "@/lib/api/news";
import { AssistedRecordNews } from "@/types/newsType";
import { sub } from "date-fns";

const useNews = (newsData: AssistedRecordNews) => {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<formAsssistedRecord>({
        resolver: zodResolver(assistedRecordSchema),
        defaultValues: {
            summary: "",
            image: undefined,
            tags: [],
        },
    });

    const handleSubmit = async (): Promise<void> => {
        try {
            const formData = getFormData(form.getValues());
            await createNews(formData);
            //router.push("/administrar-noticias");
            toast({
                title: toastMessages.successTitle,
                description: toastMessages.successDesc,
            });
        } catch (error) {
            console.log(error);
            toast({
                title: toastMessages.errorTitle,
                description: toastMessages.errorDesc,
                variant: "destructive",
            });
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

    return { form, handleSubmit };
};

export { useNews };
