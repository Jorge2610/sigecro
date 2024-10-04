import React, { useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import messages from "../newsMessages.json";
import { Popup } from "@/components/ui/popup";
import { Data, createFormData } from "./formSchema";
import { splitIntoParagraphs } from "@/lib/stringsUtil";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import axios from "axios";

interface PreviewProps {
    data?: Data | null;
    imageURL: string | null;
}

const Preview: React.FC<PreviewProps> = ({ imageURL, data }) => {
    const router = useRouter();
    const { toast } = useToast();
    const parapraphs = splitIntoParagraphs(data?.content ?? "");

    /**
     * Sends the news article to the server for publication.
     *
     * This function is responsible for creating a FormData object from the news article data,
     * sending the news article to the server, and displaying a toast based on the server's response.
     *
     * @return {Promise<void>} A promise that resolves when the operation is complete.
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

    /**
     * Redirects the user to the manual news registration page.
     *
     * @return {void} No return value.
     */
    const comeback = (): void => {
        router.push("/administrar-noticias/registro/manual");
    };

    return (
        <div className="flex flex-col gap-4">
            <h3>{data?.category?.name}</h3>
            <h2 className="text-3xl font-lora font-medium">{data?.title}</h2>
            <div className="flex items-center flex-wrap gap-4 md:gap-8">
                <div className="flex items-center">
                    <span className="material-symbols-outlined text-sig-text mr-2">
                        newspaper
                    </span>
                    {data?.source}
                </div>
                <div className="flex items-center">
                    <span className="material-symbols-outlined text-sig-text mr-2">
                        calendar_clock
                    </span>
                    {data?.date && format(data.date, "dd-MM-yyyy HH:mm")}
                </div>
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
                <Button onClick={comeback} variant="outline">
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
