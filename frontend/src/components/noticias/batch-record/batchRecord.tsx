"use client";

import { Form } from "@/components/ui/form";
import { InputSelectForm, InputTextAreaForm } from "../../ui/inputsForm";
import { CategoryType } from "@/types/categoryType";
import { useBatchRegister } from "@/hooks/news/useBatchRegister";
import NewsPopups from "../NewsPopups";
import { usePopup } from "@/hooks/news/usePopup";

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
                    name="category_id"
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
                <NewsPopups
                    open={open}
                    setOpen={handleOpen}
                    handleSubmit={onSubmit}
                    secondaryHref="/administrar-noticias/registro"
                />
            </form>
        </Form>
    );
};

export default BatchRecord;
