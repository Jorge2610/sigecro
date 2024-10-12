"use client";

import Link from "next/link";
import { useContext } from "react";
import { InputSelectForm, InputForm } from "@/components/ui/inputsForm";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AutomaticContext } from "../../../store/AssitedRecordNewsProvider";
import { useScrapingNews } from "@/hooks/useScrapingNews";
import { ButtonSubmitLoading } from "@/components/ui/button-with-loading";
import { useLoadignState } from "@/hooks/useLoadingState";

const AssistedRecord = () => {
    const { categories } = useContext(AutomaticContext);
    const { form, handleScrapingNews } = useScrapingNews();
    const { loading, handleLoagindState } = useLoadignState(handleScrapingNews);

    return (
        <Form {...form}>
            <form
                className="space-y-4"
                onSubmit={form.handleSubmit(handleLoagindState)}
            >
                <InputSelectForm
                    name="category_id"
                    label="Categoría"
                    control={form.control}
                    placeholder="Seleccione una categoría"
                    array={categories}
                />
                <InputForm
                    name="url"
                    label="URL *"
                    control={form.control}
                    placeholder="https://www.ejemplo.com"
                    type="url"
                />
                <div className="flex justify-end gap-4 mt-4">
                    <Button asChild variant={"outline"}>
                        <Link href="/administrar-noticias/registro">Atrás</Link>
                    </Button>
                    <ButtonSubmitLoading state={loading}>
                        {loading ? "Procesando..." : "Extraer"}
                    </ButtonSubmitLoading>
                </div>
            </form>
        </Form>
    );
};

export default AssistedRecord;
