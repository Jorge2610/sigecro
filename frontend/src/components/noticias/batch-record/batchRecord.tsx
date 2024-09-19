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
import { InputSelectForm } from "../manual/InputFormText";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const BatchRecord = ({ categories }: { categories: any }) => {
    const router = useRouter();
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

    const onSubmit = async () => {
        try {
            const res = await axios.post("/api/news/scraping/batch", {
                urls: form.getValues().urls,
                user_id: 1,
                category_id: form.getValues().category_id.id,
            });
            toast({
                title: "Registro exitoso",
                description:
                    "El lote de URLs fue registrado y se encuentra en proceso de captura.",
                variant: "default",
            });
            //router.push("/administrar-noticias/lote-urls");
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                </div>
            </form>
        </Form>
    );
};

export default BatchRecord;
