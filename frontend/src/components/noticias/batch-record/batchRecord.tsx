"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { InputSelectForm } from "../../ui/inputsForm";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PopupState } from "../../ui/popup";
import { useState } from "react";
import { sleep } from "@/lib/utils";

const BatchRecord = ({ categories }: { categories: any }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const formSchema = z.object({
        urls: z
            .string()
            .min(15, { message: "EL lote de URLs ingresado no es válido." }),
        category_id: z.object({
            id: z.string().min(1).max(10),
            name: z.string(),
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            urls: "",
            category_id: categories[0],
        },
    });

    /**
     * Handles the submission of a form to register a batch of URLs for scraping.
     * Sends a POST request to the server with the form data, displays a success or failure message,
     * and redirects the user to the pending URLs page if successful.
     *
     * @returns {Promise<void>} Submits the form data, displays a toast notification, and redirects the user on success.
     */
    const onSubmit = async (): Promise<void> => {
        try {
            setOpen(false);
            const res = await axios.post("/api/news/scraping/batch", {
                urls: form.getValues().urls.trim(),
                user_id: 1,
                category_id: form.getValues().category_id.id,
            });
            toast({
                title: "Registro exitoso",
                description:
                    "El lote de URLs fue registrado y se encuentra en proceso de captura.",
                variant: "default",
            });
            await sleep(1000);
            router.push("/administrar-noticias/registro/URLs-pendientes");
        } catch (error) {
            toast({
                title: "Registro fallido",
                description: "No se pudo registrar el lote de URLs.",
                variant: "destructive",
            });
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(() => setOpen(true))}
                className="space-y-4"
            >
                <InputSelectForm
                    name="category_id"
                    label="Categoría"
                    control={form.control}
                    placeholder="Seleccione una categoría"
                    array={categories}
                />
                <FormField
                    control={form.control}
                    name="urls"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL *</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={5}
                                    wrap="off"
                                    placeholder={`https://www.lostiempos.com/...\nhttps://www.opinion.com/...`}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-4">
                    <Button asChild variant={"outline"}>
                        <Link href="/administrar-noticias/registro">Atrás</Link>
                    </Button>
                    <Button type="submit">Procesar lote</Button>
                    <PopupState
                        title="Registrar lote"
                        description="¿Deseas enviar este lote de URLs para su extracción?"
                        openState={open}
                        onClose={() => {
                            setOpen(false);
                        }}
                        onConfirm={onSubmit}
                    />
                </div>
            </form>
        </Form>
    );
};

export default BatchRecord;
