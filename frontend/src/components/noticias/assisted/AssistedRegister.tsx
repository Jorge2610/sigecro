"use client";

import Link from "next/link";
import { InputSelectForm, InputForm } from "@/components/ui/inputsForm";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAssistedRegister } from "@/hooks/news/useAssistedRegister";
import { ButtonSubmitLoading } from "@/components/ui/button-with-loading";
import { useLoadignState } from "@/hooks/useLoadingState";
import { CategoryType } from "@/types/categoryType";

const AssistedRegister = ({ categories }: { categories: CategoryType[] }) => {
    const { formUrl, handleScrapingNews } = useAssistedRegister(categories);
    const { loading, handleLoagindState } = useLoadignState(handleScrapingNews);

    return (
        <Form {...formUrl}>
            <form
                className="space-y-4"
                onSubmit={formUrl.handleSubmit(handleLoagindState)}
            >
                <InputSelectForm
                    name="category"
                    label="Categoría"
                    control={formUrl.control}
                    placeholder="Seleccione una categoría"
                    array={categories}
                />
                <InputForm
                    name="url"
                    label="URL *"
                    control={formUrl.control}
                    placeholder="https://www.ejemplo.com"
                    type="url"
                />
                <div className="flex justify-end gap-4 mt-4">
                    <Button asChild variant={"outline"}>
                        <Link href="/administrar-noticias/registro">Cancelar</Link>
                    </Button>
                    <ButtonSubmitLoading state={loading}>
                        {loading ? "Procesando..." : "Extraer"}
                    </ButtonSubmitLoading>
                </div>
            </form>
        </Form>
    );
};

export default AssistedRegister;
