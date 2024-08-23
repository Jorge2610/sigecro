import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { useState } from "react";
import AutomaticPreview from "./AutomaticPreview";
import { NewsData } from "../newsInterfaces";
import messages from "../newsMessages.json";
import { useToast } from "@/components/ui/use-toast";

export default function RegistroAutomatico() {
    const { toast } = useToast();
    const [newsData, setNewsData] = useState<NewsData>();
    const [extracting, setExtracting] = useState(false);

    const formSchema = z.object({
        url: z.string().regex(new RegExp(/https?:\/{2}(\w+\.)+\w+\/\w*/), {
            message: "La URL ingresada no es válida",
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: "",
        },
    });

    /**
     * Envia la URL de la noticia para la obtención de sus datos .
     *
     * @param {z.infer<typeof FormSchema>} values - Los datos de el formulario.
     * @return {Promise<void>}
     */
    const onSubmit = async (
        values: z.infer<typeof formSchema>
    ): Promise<void> => {
        setExtracting(true);
        await axios
            .post("/api/news/scraping", {
                url: values.url,
            })
            .then((response) => {
                const data: NewsData = {
                    url: response.data.url,
                    title: response.data.title,
                    dateTime: new Date(response.data.dateTime),
                    source: response.data.source,
                    content: response.data.content,
                };
                setNewsData(data);
            })
            .catch((error) => {
                toast({
                    title: messages.toast.errorTitle,
                    description: JSON.stringify(error.message),
                    variant: "destructive",
                });
            });
        setExtracting(false);
    };

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL*</FormLabel>
                                <FormControl>
                                    <Input
                                        type="url"
                                        placeholder="https://www.ejemplo.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
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
            <Separator className="my-4" />
            {newsData !== undefined ? (
                <AutomaticPreview newsData={newsData} />
            ) : (
                ""
            )}
        </div>
    );
}
