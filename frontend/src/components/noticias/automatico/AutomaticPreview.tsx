import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { NewsData } from "../newsInterfaces";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ACCEPTED_IMAGE_TYPES, MESSAGES } from "../newsInterfaces";
import { Popup, PopupState } from "../../ui/popup";
import { InputTextAreaForm, InputSelectForm } from "../manual/InputFormText";
import { InputFileForm } from "./InputFile";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import messages from "../newsMessages.json";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AutomaticPreview = ({
    newsData,
    categories,
}: {
    newsData: NewsData;
    categories: any;
}) => {
    const [imageURL, setImageURL] = useState<string>("");
    const imageRef = useRef<HTMLImageElement>(null);
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const formSchema = z.object({
        summary: z
            .string()
            .trim()
            .min(1, { message: MESSAGES.summary.required }),
        image: z
            .instanceof(File)
            .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
                message: MESSAGES.image.format,
            })
            .refine((file) => file.size <= 2097152, {
                message: MESSAGES.image.size,
            })
            .optional(),
        category_id: z.object({
            id: z.string().min(1).max(10),
            name: z.string(),
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            summary: "",
            image: undefined,
            category_id: categories[0],
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
        newsData.content.map((paragraph) => {
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
        formData.append("title", newsData.title);
        formData.append("content", getFormatedContent());
        formData.append("date", newsData.dateTime.toISOString());
        formData.append("source", newsData.source);
        formData.append("url", newsData.url);
        formData.append("summary", data?.summary ?? "");
        data?.image && formData.append("image", data?.image, data?.image.name);
        formData.append("status", "draft");
        formData.append("category_id", data?.category_id.id ?? "");
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
        <div className="flex flex-col gap-4">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(() => setOpen(true))}
                    className="space-y-6"
                >
                    <a
                        href={newsData.url}
                        target="_blank"
                        className="underline"
                    >
                        {newsData.url}
                    </a>
                    <h2 className="text-3xl font-lora font-medium">
                        {newsData.title}
                    </h2>
                    <div className="flex items-center">
                        <span className="material-symbols-outlined text-sig-text mr-2">
                            newspaper
                        </span>
                        {newsData.source}
                        <span className="material-symbols-outlined text-sig-text ml-4 mr-2">
                            calendar_clock
                        </span>
                        {format(newsData.dateTime, "dd-MM-yyyy HH:mm")}
                    </div>
                    <InputFileForm
                        name="image"
                        label="Imagen"
                        control={form.control}
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
                        {newsData.content.map((paragraph, i) => {
                            return (
                                <p className="mb-4" key={i}>
                                    {paragraph}
                                </p>
                            );
                        })}
                    </div>
                    <Separator className="mt-[-1rem]" />
                    <InputSelectForm
                        name="category_id"
                        label="Categoría"
                        control={form.control}
                        placeholder="Seleccione una categoría"
                        array={categories}
                    />
                    <InputTextAreaForm
                        name="summary"
                        label="Resumen*"
                        control={form.control}
                        placeholder="Escriba el resumen..."
                    />
                    <div className="flex justify-end gap-4">
                        <Popup
                            title={messages.popupCancel.title}
                            description={messages.popupCancel.description}
                            href="/administrar-noticias"
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
        </div>
    );
};

export default AutomaticPreview;
