"use client";

import { Form } from "@/components/ui/form";
import { InputForm, InputTextAreaForm } from "@/components/ui/inputsForm";
import { useCategoryForm } from "@/hooks/categories/useCategoryForm";
import { H3, Head } from "@/components/ui/headings";
import { usePopup } from "@/hooks/news/usePopup";
import ButtonsWithPopup from "@/components/ui/buttons-with-popup";

const POPUP_MESSAGES = {
    primaryTitle: "Registrar categoría",
    primaryDescription: "¿Está seguro de registrar esta categoría?",
    secondaryTitle: "Cancelar registro",
    secondaryDescription: "Todos los cambios no guardados se perderán.",
};

const CreateCategoryPage = () => {
    const { form, submitData } = useCategoryForm();
    const { open, handleOpen, onSubmit } = usePopup(submitData);

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-[1024px] space-y-4">
                <Head>Formulario</Head>
                <H3 className="font-semibold text-2xl">Crear categoría</H3>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(() => handleOpen(true))}
                        className="space-y-4"
                    >
                        <InputForm
                            name="name"
                            label="Nombre *"
                            control={form.control}
                            placeholder="Escriba el nombre de la categoria"
                            max={64}
                        />
                        <InputTextAreaForm
                            label="Descripción"
                            name="description"
                            control={form.control}
                            placeholder="Descripción"
                            max={500}
                            rows={5}
                        />
                        <ButtonsWithPopup
                            handleSubmit={onSubmit}
                            open={open}
                            popupsMessages={POPUP_MESSAGES}
                            secondaryHref="/categorias"
                            setOpen={handleOpen}
                        />
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CreateCategoryPage;
