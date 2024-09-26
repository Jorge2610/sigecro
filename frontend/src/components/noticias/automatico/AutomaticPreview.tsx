"use client";

import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { NewsData } from "../newsInterfaces";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ACCEPTED_IMAGE_TYPES } from "../newsInterfaces";
import { Popup, PopupState } from "../../ui/popup";
import {
    InputTextAreaForm,
    InputFileForm,
    InputTagsForm,
} from "../manual/InputFormText";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import messages from "../newsMessages.json";
import Image from "next/image";
import { useRouter } from "next/navigation";

type AutomaticPreviewProps = {
    newsData: NewsData | undefined;
};

const AutomaticPreview = ({ newsData }: AutomaticPreviewProps) => {
    const router = useRouter();
    const [imageURL, setImageURL] = useState<string>("");
    const imageRef = useRef<HTMLImageElement>(null);
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [duplicatedTags, setDuplicatedTags] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>([]);
    const formSchema = z.object({
        summary: z
            .string()
            .trim()
            .min(1, { message: messages.summary.required }),
        image: z
            .instanceof(File)
            .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
                message: messages.image.format,
            })
            .refine((file) => file.size <= 2097152, {
                message: messages.image.size,
            })
            .optional(),
        tags: z.array(z.string().trim()).optional(),
        status: z.enum(["draft", "published", "refused"]).default("published"),
    });

    useEffect(() => {
        form.setValue("tags", tags);
        duplicatedTags
            ? form.setError("tags", {
                  type: "manual",
                  message: messages.tags.unique,
              })
            : form.clearErrors("tags");
    }, [tags, duplicatedTags]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            summary: "",
            image: undefined,
            tags: [],
        },
    });

    /**
     * Actualiza la interfaz de usuario cuando se añade una imagen a la noticia.
     *
     * @return {void}
     */
    const updateImage = (): void => {
        const image = form.getValues().image;
        if (image !== undefined) {
            setImageURL(URL.createObjectURL(image));
        } else {
            setImageURL("");
        }
    };

    /**
     * Formatea los parrafos del contenido en uno solo para su envio a la base de datos.
     *
     * @return {string}
     */
    const getFormatedContent = (): string => {
        let formatedContent: string = "";
        newsData?.content.map((paragraph) => {
            formatedContent += paragraph + "\n\n";
        });
        return formatedContent;
    };

    /**
     * Crea un FormData estandar a partir del los datos de un Formulario de Zod.
     *
     *@param {z.infer<typeof formSchema>} data - Formulario zod con los datos.
     * @return {FormData}
     */
    const getFormData = (data: z.infer<typeof formSchema>): FormData => {
        const formData = new FormData();
        formData.append("title", newsData?.title ?? "");
        formData.append("content", getFormatedContent());
        formData.append("date", newsData?.dateTime.toLocaleString() ?? "");
        formData.append("source", newsData?.source ?? "");
        formData.append("url", newsData?.url ?? "");
        formData.append("summary", data?.summary ?? "");
        data?.image && formData.append("image", data?.image, data?.image.name);
        formData.append("status", data?.status ?? "published");
        data?.tags && formData.append("tags", JSON.stringify(data?.tags));
        formData.append("category_id", newsData?.category_id ?? "");
        formData.append("user_id", "1");
        return formData;
    };

    /**
     * Esta función es responsable de enviar el articulo de noticia al servidor,
     * y mostrar un toast basado en la respuesta del servidor.
     * @return {Promise<void>}
     */
    const submitData = async (): Promise<void> => {
        setOpen(false);
        try {
            const formData = getFormData(form.getValues());
            const response = await axios.post(`/api/news`, formData);
            router.push("/administrar-noticias");
            toast({
                title: messages.toast.successTitle,
                description: response.data?.message,
            });
        } catch (error: any) {
            toast({
                title: messages.toast.errorTitle,
                description: "Ocurrio un problema al enviar la noticia.",
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
                <h2 className="text-3xl font-lora font-medium mb-2">
                    {newsData?.title}
                </h2>
                <a href={newsData?.url} target="_blank" className="underline">
                    {newsData?.url}
                </a>
                <div className="flex items-center">
                    <span className="material-symbols-outlined text-sig-text mr-2">
                        newspaper
                    </span>
                    {newsData?.source}
                    <span className="material-symbols-outlined text-sig-text ml-4 mr-2">
                        calendar_clock
                    </span>
                    {newsData !== undefined
                        ? format(newsData.dateTime, "dd-MM-yyyy HH:mm")
                        : ""}
                </div>
                <InputFileForm
                    name="image"
                    label={messages.image.label}
                    control={form.control}
                    nameImage={form.getValues().image?.name ?? null}
                    updateImage={updateImage}
                />
                {imageURL && (
                    <div className="w-full h-[300px]">
                        <Image
                            src={imageURL}
                            width={300}
                            height={200}
                            className="h-[300px] w-auto m-auto p-4"
                            alt="image"
                            ref={imageRef}
                        />
                    </div>
                )}
                <div>
                    {newsData?.content.map((paragraph: any, i: any) => {
                        return (
                            <p className="mb-4" key={i}>
                                {paragraph}
                            </p>
                        );
                    })}
                </div>
                <Separator />
                <InputTextAreaForm
                    name="summary"
                    label="Resumen *"
                    control={form.control}
                    placeholder="Escriba el resumen..."
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
                        href="/administrar-noticias/registro/asistido"
                    >
                        <Button variant="outline">Cancelar</Button>
                    </Popup>
                    <Button type="submit"> Publicar </Button>
                    <PopupState
                        title={messages.popupPublic.title}
                        description={messages.popupPublic.description}
                        openState={open}
                        onClose={() => {
                            setOpen(false);
                        }}
                        onConfirm={submitData}
                    />
                </div>
            </form>
        </Form>
    );
};

export default AutomaticPreview;
