import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import messages from "../newsMessages.json";
import { Popup } from "@/components/ui/popup";
import { Data, createFormData } from "./formSchema";
import { splitIntoParagraphs } from "@/lib/stringsUtil";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import axios from "axios";



interface PreviewProps {
    data?: Data | null;
    action?: () => void;
    imageURL: string | null;
}

const Preview: React.FC<PreviewProps> = ({ imageURL, data, action }) => {
    const { toast } = useToast();
    const parapraphs = splitIntoParagraphs(data?.content ?? "");

    /**
   * Envia la noticia a revision para ser publicada.
   *
   * Esta funcion es responsable de crear un objeto FormData a partir de los datos de la noticia,
   * enviar el articulo de noticia al servidor, y mostrar un toast basado en la respuesta del servidor.
   
   * @return {Promise<void>} Una promesa que se resuelva cuando se complete la operación.
   */
    const publicar = async (): Promise<void> => {
        if (data) {
            const formData = createFormData(data);
            try {
                const response = await axios.post(`/api/news`, formData);
                response.status === 201
                    ? toast({
                          title: messages.toast.successTitle,
                          description: response.data?.message,
                      })
                    : toast({
                          title: messages.toast.errorTitle,
                          description: response.data?.message,
                          variant: "destructive",
                      });
            } catch (error: any) {
                toast({
                    title: messages.toast.errorTitle,
                    description: JSON.stringify(error.message),
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <h3>{data?.category?.name}</h3>
            <h2 className="text-3xl font-lora font-medium">{data?.title}</h2>
            <div className="flex items-center">
                <span className="material-symbols-outlined text-sig-text mr-2">
                    newspaper
                </span>
                {data?.source}
                <span className="material-symbols-outlined text-sig-text ml-20 mr-2">
                    calendar_clock
                </span>
                {data?.date && format(data.date, "dd-MM-yyyy HH:mm")}
            </div>
            <Summary summary={data?.summary} />
            {imageURL && (
                <div className="w-full h-[300px]">
                    <Image
                        src={imageURL}
                        width={300}
                        height={200}
                        className="h-[300px] w-auto m-auto p-4"
                        alt="image"
                    />
                </div>
            )}
            <div>
                {parapraphs.map((paragraph, i) => {
                    return (
                        <p className="mb-4" key={i}>
                            {paragraph}
                        </p>
                    );
                })}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
                {data?.tags?.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-sig-gray2 h-7 hover:bg-sig-gray2"
                    >
                        {tag}
                    </Badge>
                ))}
            </div>
            {data?.url && (
                <div className="flex flex-row gap-4 align-middle">
                    <span className="material-symbols-outlined">link</span>
                    <a
                        href={data?.url}
                        target="_blank"
                        className="underline flex align-middle"
                    >
                        {data?.url}
                    </a>
                </div>
            )}
            <div className="flex flex-row justify-end gap-4">
                <Button onClick={action} variant="outline">
                    {" "}
                    Regresar{" "}
                </Button>
                <Popup
                    title={messages.popupPublic.title}
                    description={messages.popupPublic.description}
                    href="/administrar-noticias"
                    action={publicar}
                >
                    <Button>Publicar</Button>
                </Popup>
            </div>
        </div>
    );
};

interface Props {
    summary: string | undefined;
}
const Summary = ({ summary }: Props) => {
    return (
        <div className="w-full p-4 bg-sig-gray2 rounded-xl">
            <h3 className="font-lora font-semibold text-sig-blue">Resumen</h3>
            <br />
            <p className="text-sm font-regular">{summary}</p>
        </div>
    );
};

export default Preview;
