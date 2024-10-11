/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { NewsData } from "../../../types/newsType";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ACCEPTED_IMAGE_TYPES } from "../../../types/newsType";
import { Popup, PopupState } from "../../ui/popup";
import {
    InputTextAreaForm,
    InputFileForm,
    InputTagsForm,
} from "../../ui/inputsForm";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import messages from "../newsMessages.json";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ButtonLoading } from "@/components/ui/button-with-loading";
import { sub } from "date-fns";
import { H1 } from "@/components/ui/headings";

type PreviewProps = {
    newsData: NewsData;
};

const Preview = ({ newsData }: PreviewProps) => {
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
        formData.append(
            "date",
            sub(newsData.dateTime, { hours: 4 }).toISOString() ?? ""
        );
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

    /**
     * Genera un resumen del contenido formateado y lo establece en el formulario.
     *
     * @returns {Promise<void>} No devuelve ningún valor, pero actualiza el formulario con el resumen generado o lanza un error.
     */
    const generateSummary = async (): Promise<void> => {
        const text = getFormatedContent();
        await axios
            .get("/api/news/summary", {
                params: { text: text },
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
                    title: "Error al generar el resumen",
                });
            });
    };
    /**
     * Genera un las etiquetas del contenido formateado y lo establece en el formulario.
     *
     * @returns {Promise<void>} No devuelve ningún valor, pero actualiza el formulario con el resumen generado o lanza un error.
     */
    const generateTags = async (): Promise<void> => {
        const content = getFormatedContent();
        await axios
            .get("/api/news/tags", {
                params: { text: content },
            })
            .then((response) => {
                console.log(response.data);
                setTags(response.data);
            })
            .catch((error) => {
                console.log(error);
                toast({
                    variant: "destructive",
                    title: "Error al generar las etiquetas",
                });
            });
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(() => setOpen(true))}
                className="space-y-4 mt-4"
            >
                <H1>{newsData?.title}</H1>
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined">link</span>
                    <a
                        href={newsData?.url}
                        target="_blank"
                        className="underline"
                    >
                        {newsData?.url}
                    </a>
                </div>
                <div className="flex items-center flex-wrap gap-4 md:gap-8">
                    <div className="flex items-center">
                        <span className="material-symbols-outlined text-sig-text mr-2">
                            newspaper
                        </span>
                        {newsData?.source}
                    </div>
                    <div className="flex items-center">
                        <span className="material-symbols-outlined text-sig-text mr-2">
                            calendar_clock
                        </span>
                        {newsData !== undefined
                            ? format(newsData.dateTime, "dd-MM-yyyy HH:mm")
                            : ""}
                    </div>
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
                    rows={5}
                    placeholder="Escriba el resumen..."
                />
                <div className="flex justify-end">
                    <ButtonLoading
                        action={generateSummary}
                        title="Resumen con IA"
                        titleOnLoading="Generando..."
                    />
                </div>

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
                        titleOnLoading="Generando..."
                    />
                </div>
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

export default Preview;
