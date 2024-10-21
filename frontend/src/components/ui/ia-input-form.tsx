import { InputTextAreaForm, InputTagsForm } from "./inputsForm";
import { ButtonLoading } from "./button-with-loading";
import { formAsssistedRecord } from "@/types/registerSchemas";
import { Control } from "react-hook-form";
import { useEffect, useState } from "react";

interface IAInputFormProps {
    control: Control<formAsssistedRecord>;
    action: () => Promise<void>;
}

const labels = {
    summary: {label :  "Resumen * ", placeholder: "Escriba el resumen...", iaTitle : "Resumen con IA"},
    tags: {label : "Etiquetas * ", placeholder: "Escriba las etiquetas...", required: "Etiquetas requeridas", iaTitle: "Etiquetas con IA"},
    titleLoading: "Generando..."
}

const SummaryInputForm = ({ control, action }: IAInputFormProps) => {
    return (
        <>
            <InputTextAreaForm
                name="summary"
                label={labels.summary.label}
                control={control}
                rows={5}
                placeholder={labels.summary.placeholder}
            />
            <div className="flex justify-end">
                <ButtonLoading
                    action={action}
                    title={labels.summary.iaTitle}
                    titleOnLoading={labels.titleLoading}
                />
            </div>
        </>
    );
};

const TagsInputForm = ({ control, action }: IAInputFormProps) => {
    const [tags,setTags] = useState<string[]>([])
    const [duplicatedTags,setDuplicatedTags] = useState<boolean>(false)
    
    useEffect(() => {
        form.setValue("tags", tags);
        duplicatedTags
            ? form.setError("tags", {
                  type: "manual",
                  message: labels.tags.required,
              })
            : form.clearErrors("tags");
    }, [tags, duplicatedTags]);
    
    return (
        <>
            <InputTagsForm
                setDuplicatedTags={setDuplicatedTags}
                control={control}
                name="tags"
                label={labels.tags.label}
                tags={tags}
                setTags={setTags}
            />
            <div className="w-full flex flex-row justify-between align-middle">
                <p className="text-sig-text text-xs">
                    {tags.length}/5 Etiquetas
                </p>
                <ButtonLoading
                    action={action}
                    title="Etiquetas con IA"
                    titleOnLoading="Generando..."
                />
            </div>
        </>
    );
};

export { SummaryInputForm, TagsInputForm };
