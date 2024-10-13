import { formAsssistedRecord } from "@/types/registerType";
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

const MESSAGE_ERROR: string = "Etiquetas duplicadas";

const useTags = (form: UseFormReturn<formAsssistedRecord>) => {
    const [tags, setTags] = useState<string[]>([]);
    const [duplicatedTags, setDuplicatedTags] = useState<boolean>(false);

    useEffect(() => {
        form.setValue("tags", tags);
        duplicatedTags
            ? form.setError("tags", {
                  type: "manual",
                  message: MESSAGE_ERROR,
              })
            : form.clearErrors("tags");
    }, [tags, duplicatedTags]);

    const handleTags = (tags: string[]) => {
        setTags((_) => tags);
    };

    const handleDuplicatedTags = (value: boolean) => {
        setDuplicatedTags((_) => value);
    };

    return { tags, handleTags, handleDuplicatedTags };
};

export { useTags };
