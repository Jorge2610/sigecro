import { Form } from "@/components/ui/form";
import {
    InputTextAreaForm,
    InputFileForm,
    InputTagsForm,
} from "../../ui/inputsForm";
import messages from "../newsMessages.json";
import { useState, useEffect } from "react";
import { ButtonLoading } from "@/components/ui/button-with-loading";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Popup, PopupState } from "../../ui/popup";
import { Button } from "@/components/ui/button";
import { AssistedRecordNews } from "@/types/newsType";
import { useNews } from "@/hooks/useNews";

interface AssistedFormProps {
    newsData: AssistedRecordNews;
    setImageUrl: (url: string) => void;
}

const AssistedForm = ({ newsData, setImageUrl }: AssistedFormProps) => {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const { form, handleSubmit } = useNews(newsData);
    const [tags, setTags] = useState<string[]>([]);
    const [duplicatedTags, setDuplicatedTags] = useState<boolean>(false);
    useEffect(() => {
        form.setValue("tags", tags);
        duplicatedTags
            ? form.setError("tags", {
                  type: "manual",
                  message: "Tags duplicadas",
              })
            : form.clearErrors("tags");
    }, [tags, duplicatedTags]);

    const updateImage = (): void => {
        const image = form.getValues().image;
        if (image !== undefined) {
            setImageUrl(URL.createObjectURL(image));
        } else {
            setImageUrl("");
        }
    };

    const getFormatedContent = (): string => {
        let formatedContent: string = "";
        newsData.content.map((paragraph) => {
            formatedContent += paragraph + "\n\n";
        });
        return formatedContent;
    };

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

    const submitData = async (): Promise<void> => {
        setOpen(false);
        handleSubmit();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(() => setOpen(true))}
                className="space-y-4"
            >
                <InputFileForm
                    name="image"
                    label={messages.image.label}
                    control={form.control}
                    nameImage={form.getValues().image?.name}
                    updateImage={updateImage}
                />
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

export default AssistedForm;
