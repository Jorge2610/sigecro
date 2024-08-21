"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { capitalizeWords } from "@/lib/stringsUtil";
import messages from "@/lib/JSON/newsMessages.json";

import {
  InputForm,
  InputDateForm,
  InputTextAreaForm,
  InputSelectForm,
  InputFileForm,
} from "./InputFormText";

import InputTagsForm from "./tags";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Popup from "../../ui/popup";
import FormSchema from "./formSchema";
import Preview from "./NewPreview";
const NewsForm = ({
  preview,
  setPreview,
  setRecordType,
}: {
  preview: boolean;
  setPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setRecordType: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [data, setData] = useState<z.infer<typeof FormSchema> | null>(null);
  const [imageURL, setImageURL] = useState<null | string>(null);

  type Data = {
    id: string;
    name: string;
  };

  const categories: null | Data[] = [
    { id: "1", name: "Noticias" },
    { id: "2", name: "Categoría 2" },
  ];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
      date: undefined,
      source: "",
      url: "",
      summary: "",
      image: undefined,
      status: "draft",
      tags: [],
      category: categories[0] || { id: "1", name: "Noticias" },
      user_id: "1",
    },
  });

  /**
   * Maneja el envío del formulario actualizando el estado del componente con los datos enviados.
   *
   * @param {z.infer<typeof FormSchema>} data - Los datos enviados por el formulario.
   * @return {void}
   */
  const onSubmit = (data: z.infer<typeof FormSchema>): void => {
    data.source = capitalizeWords(data.source);
    setImageURL(data.image ? URL.createObjectURL(data.image) : null);
    setData(data);
    setPreview(true);
    setRecordType("manual");
  };

  /**
   * Resets the form to its initial state, clearing the image preview and setting the preview mode to false.
   *
   * @return {void}
   */
  const comeBack = (): void => {
    form.reset(data || {});
    setImageURL(null);
    setPreview(false);
  };

  /**
   * Resetea el formulario a su estado inicial.
   *
   * @return {void}
   */
  const cleanForm = (): void => {
    form.reset({
      title: "",
      content: "",
      date: undefined,
      source: "",
      url: "",
      summary: "",
      image: undefined,
      status: "draft",
      tags: [],
      category: categories[0] || { id: "1", name: "Noticias" },
      user_id: "1",
    });
    setData(null);
    setImageURL(null);
  };

  return (
    <>
      {!preview ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <InputForm
              name="title"
              label={messages.title.label}
              control={form.control}
              placeholder={messages.title.placeholder}
              max={255}
            />

            <InputForm
              name="source"
              label={messages.source.label}
              control={form.control}
              placeholder={messages.source.placeholder}
              max={64}
            />

            <InputDateForm
              name="date"
              label={messages.date.label}
              control={form.control}
              placeholder={messages.date.placeholder}
            />

            <InputTextAreaForm
              name="content"
              label={messages.content.label}
              control={form.control}
              rows={10}
              placeholder={messages.content.placeholder}
            />

            <InputTextAreaForm
              name="summary"
              label={messages.summary.label}
              control={form.control}
              placeholder={messages.summary.placeholder}
            />

            <InputForm
              name="url"
              label={messages.url.label}
              control={form.control}
              placeholder={messages.url.placeholder}
              max={300}
            />

            <InputSelectForm
              name="category"
              label={messages.category.label}
              control={form.control}
              placeholder={messages.category.placeholder}
              array={categories}
            />

            <InputFileForm
              name="image"
              label={messages.image.label}
              control={form.control}
            />

            <div className="flex justify-end gap-4">
              <Popup
                title={messages.popupCancel.title}
                description={messages.popupCancel.description}
                action={cleanForm}
                href="/administrar-noticias"
              >
                <Button variant="outline">Cancelar</Button>
              </Popup>
              <Button type="submit"> Previsualizar </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Preview imageURL={imageURL} data={data as any} action={comeBack} />
      )}
    </>
  );
};

export default NewsForm;
