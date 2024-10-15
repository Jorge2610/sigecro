import { zodResolver } from "@hookform/resolvers/zod";
import {
    formManualRegister,
    manualRegisterSchema,
} from "@/types/registerSchemas";
import { useForm } from "react-hook-form";
import { CategoryType } from "@/types/categoryType";
import { capitalizeWords } from "@/lib/stringsUtil";
import { useRouter } from "next/navigation";
import { useManualNewsContext } from "@/store/ManualNewsProvider";

const useManualRegister = (categories: CategoryType[]) => {
    const { setImageURL, setNewsData } = useManualNewsContext();
    const router = useRouter();
    const form = useForm<formManualRegister>({
        resolver: zodResolver(manualRegisterSchema),
        defaultValues: {
            title: "",
            content: "",
            date: undefined,
            source: "",
            url: "",
            summary: "",
            image: undefined,
            status: "published",
            tags: [],
            category_id: categories[0].id,
            user_id: "1",
        },
    });

    const onSubmit = (data: formManualRegister): void => {
        data.source = capitalizeWords(data.source);
        setImageURL &&
            setImageURL(data.image ? URL.createObjectURL(data.image) : null);
        setNewsData && setNewsData(data);
        router.push("/administrar-noticias/registro/manual/vista-previa");
    };

    const cleanForm = (): void => {
        form.reset({
            title: "",
            content: "",
            date: undefined,
            source: "",
            url: "",
            summary: "",
            image: undefined,
            status: "published",
            tags: [],
            category_id: categories[0].id,
            user_id: "1",
        });
        setNewsData && setNewsData(null);
        setImageURL && setImageURL(null);
    };

    return { form, onSubmit, cleanForm };
};

export { useManualRegister };
