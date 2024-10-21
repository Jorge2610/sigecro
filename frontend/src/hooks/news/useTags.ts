import { FieldPath, FieldValues, PathValue, UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";

const MESSAGE_ERROR: string = "Etiquetas duplicadas";

const useTags = <T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: FieldPath<T>
) => {
  const [tags, setTags] = useState<string[]>([]);
  const [duplicatedTags, setDuplicatedTags] = useState<boolean>(false);

  useEffect(() => {
    form.setValue(fieldName, tags as unknown as PathValue<T, typeof fieldName>); 
    duplicatedTags
      ? form.setError(fieldName, {
          type: "manual",
          message: MESSAGE_ERROR,
        })
      : form.clearErrors(fieldName);
  }, [tags, duplicatedTags, form, fieldName]);

  const handleTags = (tags: string[]) => {
    setTags((_) => tags);
  };

  const handleDuplicatedTags = (value: boolean) => {
    setDuplicatedTags((_) => value);
  };

  return { tags, handleTags, handleDuplicatedTags };
};

export { useTags };