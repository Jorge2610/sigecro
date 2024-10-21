"use client";

import { Form } from "@/components/ui/form";
import { InputSelectForm, InputTextAreaForm } from "../../ui/inputsForm";
import { CategoryType } from "@/types/categoryType";
import { useBatchRegister } from "@/hooks/news/useBatchRegister";
import { usePopup } from "@/hooks/news/usePopup";
import ButtonsWithPopup from "@/components/ui/buttons-with-popup";

const POPUP_MESSAGES = {
    primaryTitle: "Registrar URL",
    primaryDescription:
        "¿Está seguro de que quiere registrar las URL para su recopilación?",
    secondaryTitle: "Cancelar registro",
    secondaryDescription: "Todos los cambios no guardados se perderán.",
};

interface BatchRecordProps {
    categories: CategoryType[];
}

const BatchRecord = ({ categories }: BatchRecordProps) => {
    const { form, submitData } = useBatchRegister(categories);
    const { open, handleOpen, onSubmit } = usePopup(submitData);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(() => handleOpen(true))}
                className="space-y-4"
            >
                <InputSelectForm
                    name="category"
                    label="Categoría"
                    control={form.control}
                    placeholder="Seleccione una categoría"
                    array={categories}
                />
                <InputTextAreaForm
                    control={form.control}
                    name="urls"
                    placeholder={`https://www.lostiempos.com/...\nhttps://www.opinion.com/...`}
                    rows={5}
                    wrap="off"
                />
                <ButtonsWithPopup
                    open={open}
                    setOpen={handleOpen}
                    handleSubmit={onSubmit}
                    secondaryHref="/administrar-noticias/registro"
                    popupsMessages={POPUP_MESSAGES}
                />
            </form>
        </Form>
    );
};

export default BatchRecord;
