import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { capitalizeWords } from "@/lib/stringsUtil";
import messages from "../newsMessages.json";

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
import Preview from "./NewsPreview";

const NewsForm = ({
    preview,
    setPreview,
    setRecordType,
    categories,
}: {
    preview: boolean;
    setPreview: React.Dispatch<React.SetStateAction<boolean>>;
    setRecordType: React.Dispatch<React.SetStateAction<string>>;
    categories: any;
}) => {
    const [tags, setTags] = useState<string[]>([]);
    const [data, setData] = useState<Data | null>(null);
    const [imageURL, setImageURL] = useState<null | string>(null);
    const [duplicatedTags, setDuplicatedTags] = useState<boolean>(false);

    useEffect(() => {
        form.setValue("tags", tags);
        duplicatedTags
            ? form.setError("tags", {
                  type: "manual",
                  message: messages.tags.unique,
              })
            : form.clearErrors("tags");
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            status: "draft",
            tags: [],
            category: categories[0],
            user_id: "1",
        },
    });

    /**
     * Maneja el envío del formulario actualizando el estado del componente con los datos enviados.
     *
     * @param {z.infer<typeof FormSchema>} data - Los datos enviados por el formulario.
     * @return {void}
     */
    const onSubmit = (data: Data): void => {
        data.source = capitalizeWords(data.source);
        setImageURL(data.image ? URL.createObjectURL(data.image) : null);
        setData(data);
        setPreview(true);
        setRecordType("manual");
    };

    /**
     * Resete el formulario al estado inicial, limpiando la imagen previa y estableciendo el modo de vista previa en falso.
     *
     * @return {void}
     */
    const comeBack = (): void => {
        form.reset(data || {});
        setImageURL(null);
        setPreview(false);
    };

    /**
     * Resetea el formulario a su estado inicial.
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
            status: "draft",
            tags: [],
            category: categories[0],
            user_id: "1",
        });
        setData(null);
        setImageURL(null);
    };

    return (
        <>
            {!preview ? (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
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
                        />
                        
                        <Button>Resumen</Button>

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
            ) : (
                <Preview
                    imageURL={imageURL}
                    data={data as any}
                    action={comeBack}
                />
            )}
        </>
    );
};

export default NewsForm;
