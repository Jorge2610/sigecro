/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useState, useEffect, useContext } from "react";
import { capitalizeWords } from "@/lib/stringsUtil";
import messages from "../newsMessages.json";
import { useToast } from "../../ui/use-toast";
import {
    InputForm,
    InputDateForm,
    InputTextAreaForm,
    InputSelectForm,
    InputFileForm,
    InputTagsForm,
} from "./InputFormText";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Popup } from "@/components/ui/popup";
import FormSchema, { Data } from "./formSchema";
import axios from "axios";
import ButtonLoading from "@/components/ui/button-with-loading";
import { NewsManualContext } from "./ManualNewsProvider";
import { useRouter } from "next/navigation";

interface Props {
    categories: any;
}
const NewsForm = ({ categories }: Props) => {
    const { toast } = useToast();
    const router = useRouter();
    const [tags, setTags] = useState<string[]>([]);
    const [duplicatedTags, setDuplicatedTags] = useState<boolean>(false);

    const context = useContext(NewsManualContext);
    const newsData = context?.newsData;
    const setNewsData = context?.setNewsData;
    const setImageURL = context?.setImageURL;

    useEffect(() => {
        form.setValue("tags", tags);
        duplicatedTags
            ? form.setError("tags", {
                  type: "manual",
                  message: messages.tags.unique,
              })
            : form.clearErrors("tags");
    }, [tags, duplicatedTags]);

    const form = useForm<Data>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            content: "",
            date: undefined,
            source: "",
            url: "",
            summary: "",
            image: undefined,
            status: "published",
            tags: [],
            category: categories[0],
            user_id: "1",
        },
    });

    useEffect(() => {
        newsData && form.reset(newsData);
        newsData && setTags(newsData.tags ?? []);
    }, []);

    
    /**
     * Handles the submission of the form by updating the component state with the sent data.
     *
     * @param {Data} data - The data sent by the form.
     * @return {void}
     */
    const onSubmit = (data: Data): void => {
        data.source = capitalizeWords(data.source);
        setImageURL &&
            setImageURL(data.image ? URL.createObjectURL(data.image) : null);
        setNewsData && setNewsData(data);
        router.push("/administrar-noticias/registro/manual/vista-previa");
    };

    /**
     * Resets the form to its initial state, clearing all fields and resetting the news data and image URL.
     *
     * @return {void}
     */
    const cleanForm = (): void => {
        form.reset({
            title: "",
            content: "",
            date: undefined,
            source: "",
            url: "",
            summary: "",
            image: undefined,
            status: "published",
            tags: [],
            category: categories[0],
            user_id: "1",
        });
        setNewsData && setNewsData(null);
        setImageURL && setImageURL(null);
    };

    const generateSummary = async (): Promise<void> => {
        const content = form.getValues("content");
        const valid = await form.trigger("content");
        if (valid) {
            await axios
                .get("/api/news/summary", {
                    params: { text: content },
                })
                .then((response) => {
                    form.setValue("summary", response.data, {
                        shouldValidate: true,
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast({
                        variant: "destructive",
                        title: "Error al guardar",
                        description: "Servidor no encontrado.",
                    });
                });
        } else {
            form.setFocus("content");
            form.setError("summary", {
                type: "manual",
                message:
                    "Es necesario el contenido para generar el resumen con la IA",
            });
        }
    };

    const generateTags = async (): Promise<void> => {
        const content = form.getValues("content");
        const valid = await form.trigger("content");
        if (valid) {
            await axios
                .get("/api/news/tags", {
                    params: { text: content },
                })
                .then((response) => {
                    const tags = response.data;
                    setTags(tags);
                })
                .catch((error) => {
                    console.log(error);
                    toast({
                        variant: "destructive",
                        title: "Error al guardar",
                        description: "Servidor no encontrado.",
                    });
                });
        } else {
            form.setFocus("content");
            form.setError("tags", {
                type: "manual",
                message:
                    "Es necesario el contenido para generar las etiquetas con la IA",
            });
        }
    };
    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <InputForm
                        name="title"
                        label={messages.title.label}
                        control={form.control}
                        placeholder={messages.title.placeholder}
                        max={255}
                    />

                    <InputForm
                        name="source"
                        label={messages.source.label}
                        control={form.control}
                        placeholder={messages.source.placeholder}
                        max={64}
                    />

                    <InputDateForm
                        name="date"
                        label={messages.date.label}
                        control={form.control}
                        placeholder={messages.date.placeholder}
                    />

                    <InputTextAreaForm
                        name="content"
                        label={messages.content.label}
                        control={form.control}
                        rows={10}
                        placeholder={messages.content.placeholder}
                    />

                        <InputTextAreaForm
                            name="summary"
                            label={messages.summary.label}
                            control={form.control}
                            placeholder={messages.summary.placeholder}
                            max={768}
                        />

                        <div className="flex justify-end">
                            <ButtonLoading
                                action={generateSummary}
                                title="Resumen con IA"
                                loading="Generando..."
                            />
                        </div>

                        <InputForm
                            name="url"
                            label={messages.url.label}
                            control={form.control}
                            placeholder={messages.url.placeholder}
                            max={300}
                        />

                    <InputSelectForm
                        name="category"
                        label={messages.category.label}
                        control={form.control}
                        placeholder={messages.category.placeholder}
                        array={categories}
                    />

                    <InputFileForm
                        name="image"
                        label={messages.image.label}
                        control={form.control}
                        nameImage={form.getValues().image?.name ?? null}
                    />

                        <InputTagsForm
                            setDuplicatedTags={setDuplicatedTags}
                            control={form.control}
                            name="tags"
                            label={messages.tags.label}
                            tags={tags}
                            setTags={setTags}
                        />
                        <div className="w-full flex flex-row justify-between align-middle">
                            <p className="text-sig-text text-xs">
                                {tags.length}/5 Etiquetas
                            </p>
                            <ButtonLoading
                                action={generateTags}
                                title="Etiquetas con IA"
                                loading="Generando..."
                            />
                        </div>

                    <div className="flex justify-end gap-4">
                        <Popup
                            title={messages.popupCancel.title}
                            description={messages.popupCancel.description}
                            action={cleanForm}
                            href="/administrar-noticias"
                        >
                            <Button variant="outline">Cancelar</Button>
                        </Popup>
                        <Button type="submit"> Previsualizar </Button>
                    </div>
                </form>
            </Form>
        </>
    );
};

export default NewsForm;
