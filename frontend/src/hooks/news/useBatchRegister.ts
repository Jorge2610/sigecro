import { CategoryType } from "@/types/categoryType";
import { batchRegisterSchema, formBatchRegister } from "@/types/registerType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { sleep } from "@/lib/utils";
import { createBatchUrl } from "@/lib/api/scraping";
import { useHandleToast } from "../useHandleToast";

const useBatchRegister = (categories: CategoryType[]) => {
    const { showToast } = useHandleToast();
    const router = useRouter();

    const form = useForm<formBatchRegister>({
        resolver: zodResolver(batchRegisterSchema),
        defaultValues: {
            urls: "",
            category_id: categories[0],
        },
    });

    const submitData = async (): Promise<void> => {
        try {
            await createBatchUrl(
                form.getValues().urls.trim(),
                1,
                form.getValues().category_id.id
            );
            showToast(
                true,
                "El lote de URLs fue registrado y se encuentra en proceso de captura."
            );
            await sleep(500);
            router.push("/administrar-noticias/registro/URLs-pendientes");
        } catch (error) {
            showToast(false, "No se pudo registrar el lote de URLs.");
        }
    };

    return { form, submitData };
};

export { useBatchRegister };
