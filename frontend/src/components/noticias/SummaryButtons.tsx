import { Control, useController } from "react-hook-form";
import { ButtonLoading } from "../ui/button-with-loading";
import { generateSummary } from "@/lib/api/IA";
import { useToast } from "@/components/ui/use-toast";
import { formAsssistedRecord } from "@/types/registerType";
import { Button } from "../ui/button";
import { getFormatedContent } from "@/lib/stringsUtil";

interface SummaryButtonsProps {
    control: Control<formAsssistedRecord>;
    content: string[];
}

const MESSAGE_ERROR = "Error al generar el resumen";

const SummaryButtons = ({ content, control }: SummaryButtonsProps) => {
    const { toast } = useToast();
    const { field } = useController({ name: "summary", control });

    const handleIASummary = async (): Promise<void> => {
        try {
            const summary = await generateSummary(getFormatedContent(content));
            field.onChange(summary);
        } catch (error) {
            toast({
                variant: "destructive",
                title: MESSAGE_ERROR,
            });
        }
    };

    const handleFirstParagraph = (): void => {
        let firstParagraph = content[0];
        if (firstParagraph.length < 256 && content.length > 1) {
            firstParagraph += "\n\n" + content[1];
        }
        field.onChange(firstParagraph);
    };

    return (
        <div className="flex justify-end gap-4">
            <Button
                type="button"
                variant="outline"
                onClick={handleFirstParagraph}
            >
                Primer parrafo
            </Button>
            <ButtonLoading
                action={handleIASummary}
                title="Resumen con IA"
                titleOnLoading="Generando..."
            />
        </div>
    );
};

export default SummaryButtons;
