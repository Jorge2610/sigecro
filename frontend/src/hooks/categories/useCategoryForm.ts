import { useForm } from "react-hook-form";
import { categorySchema } from "@/types/categoryType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CategoryType } from "@/types/categoryType";
import { useHandleToast } from "../useHandleToast";
import { createCategory } from "@/lib/api/categories";

const SUCCESS_MESSAGE = "La categoría se guardo correctamente.";
const DUPLICATE_MESSAGE = "La categoría ya existe.";
const ERROR_MESSAGE = "Hubo un error al guardar la categoría.";

const useCategoryForm = () => {
    const router = useRouter();
    const { showToast } = useHandleToast();

    const form = useForm<CategoryType>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const submitData = async (): Promise<void> => {
        try {
            await createCategory(form.getValues());
            showToast("success", SUCCESS_MESSAGE);
            router.push("/categorias");
        } catch (error: any) {
            error.response.status === 409
                ? showToast("error", DUPLICATE_MESSAGE)
                : showToast("error", ERROR_MESSAGE);
        }
    };

    return { form, submitData };
};

export { useCategoryForm };
