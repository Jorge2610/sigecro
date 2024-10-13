import { ButtonLoading } from "../ui/button-with-loading";
import { generateTags } from "@/lib/api/IA";
import { useToast } from "@/components/ui/use-toast";

interface TagButtonProps {
    setTags: (tags: string[]) => void;
    content: string;
    tagsCount: number;
}

const MESSAGE_ERROR = "Error al generar las etiquetas";

const TagButton = ({ setTags, content, tagsCount }: TagButtonProps) => {
    const { toast } = useToast();

    const handleGenerateTags = async (): Promise<void> => {
        try {
            const tags = await generateTags(content);
            setTags(tags);
        } catch (error) {
            toast({
                variant: "destructive",
                title: MESSAGE_ERROR,
            });
        }
    };
    return (
        <div className="w-full flex flex-row justify-between align-middle">
            <p className="text-sig-text text-xs">{tagsCount}/5 Etiquetas</p>
            <ButtonLoading
                action={handleGenerateTags}
                title="Etiquetas con IA"
                titleOnLoading="Generando..."
            />
        </div>
    );
};
export default TagButton;
