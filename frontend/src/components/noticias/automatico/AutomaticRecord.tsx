"use client";

import Link from "next/link";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import {
    formAsssistedReister,
    assistedRegisterFormSchema,
} from "@/types/registerType";

import { InputSelectForm, InputForm } from "@/components/ui/inputsForm";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { AutomaticContext } from "../../../store/AssitedRecordNewsProvider";
import { useExtractNews } from "@/hooks/useExtractNews";

const RegistroAutomatico = () => {
    const { categories, setNewsData } = useContext(AutomaticContext);
    const [extracting, setExtracting] = useState(false);

    const form = useForm<formAsssistedReister>({
        resolver: zodResolver(assistedRegisterFormSchema),
        defaultValues: {
            url: "",
            category_id: categories && categories[0],
        },
    });

    const handleExtracNews = useExtractNews(form, setExtracting, setNewsData);

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleExtracNews)}
                    className="space-y-4"
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
                    <div className="flex justify-end gap-4">
                        <Button asChild variant={"outline"}>
                            <Link href="/administrar-noticias/registro">
                                Atrás
                            </Link>
                        </Button>
                        <Button type="submit" disabled={extracting}>
                            {extracting ? (
                                <>
                                    <svg
                                        className="material-symbols-outlined animate-spin h-5 w-5 text-white mr-2 "
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                        circle
                                    </svg>
                                    Procesando...
                                </>
                            ) : (
                                "Extraer"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default RegistroAutomatico;
