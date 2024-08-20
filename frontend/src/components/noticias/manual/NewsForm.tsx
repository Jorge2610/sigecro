"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { capitalizeWords } from "@/lib/stringsUtil";

import {
  InputForm,
  InputDateForm,
  InputTextAreaForm,
  InputSelectForm,
  InputFileForm,
} from "./InputFormText";

import InputTagsForm from "./tags";
import Preview from "./NewPreview";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import Popup from "../../ui/popup";
import axios from "axios";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpeg",
  "image/webp",
];

const mesages = {
  title: {
    required: "El título es obligatorio",
  },
  source: {
    required: "La fuente es obligatoria (Ej: Los Tiempos, Opinión, etc)",
  },
  date: {
    required: "La fecha es obligatoria",
    max: "La fecha no puede ser mayor a la fecha actual",
  },
  content: {
    required: "El contenido es obligatorio",
  },
  summary: {
    required: "El resumen es obligatoria",
  },
  url: {
    format: "La URL no es válida",
  },
  image: {
    format:
      "El formato del archivo no es válido por favor sube una imagen en formato JPG, PNG o WEBP",
    size: "El tamaño de la imagen no puede ser mayor a 2MB",
  },
  tags: {
    max: "El número de etiquetas no puede ser mayor a 5",
  },
};

const FormSchema = z.object({
  title: z.string().min(1, { message: mesages.title.required }),
  content: z.string().min(1, { message: mesages.content.required }),
  date: z
    .date({ required_error: mesages.date.required })
    .max(new Date(), { message: mesages.date.max }),
  source: z.string().min(1, { message: mesages.source.required }),
  url: z
    .union([z.string().url({ message: mesages.url.format }), z.literal("")])
    .optional(),
  summary: z.string().min(1, { message: mesages.summary.required }),
  image: z
    .instanceof(File)
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: mesages.image.format,
    })
    .refine((file) => file.size <= 2097152, {
      message: mesages.image.size,
    })
    .optional(),
  status: z.enum(["draft", "published", "refused"]).default("draft"),
  tags: z
    .array(z.string().max(20))
    .max(5, { message: mesages.tags.max })
    .optional(),
  category_id: z.string().min(1).max(10),
  user_id: z.string().min(1).max(10),
});

const InputFile = () => {
  const [preview, setPreview] = useState(false);
  const [data, setData] = useState<z.infer<typeof FormSchema> | null>(null);
  const [urlImage, setUrlImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [tags, setTags] = useState<string[]>([]);

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
      category_id: "1",
      user_id: "1",
    },
  });
  type Data = {
    id: string;
    name: string;
  };

  const categories: null | Data[] = [{ id: "1", name: "Categoría 1" }];

  /**
   * Maneja el envío del formulario actualizando el estado del componente con los datos enviados.
   *
   * @param {z.infer<typeof FormSchema>} data - Los datos enviados por el formulario.
   * @return {void}
   */
  const onSubmit = (data: z.infer<typeof FormSchema>): void => {
    form.setValue("source", capitalizeWords(data.source));
    setUrlImage(data.image ? URL.createObjectURL(data.image) : null);
    setData(data);
    setPreview(true);
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
      category_id: "1",
      user_id: "1",
    });
    setData(null);
    setUrlImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };
  const { toast } = useToast();

  /**
   * Envia el formulario de la noticia al servidor.
   *
   * @return {Promise<void>} Una promesa que resuelve cuando la operación es completada.
   * @throws {Error} Si ocurre un error al enviar el formulario.
   */
  const publicar = async (): Promise<void> => {
    try {
      const formData = new FormData();

      formData.append("title", data?.title ?? "");
      formData.append("content", data?.content ?? "");
      formData.append("date", data?.date?.toISOString() ?? "");
      formData.append("source", data?.source ?? "");
      formData.append("url", data?.url ?? "");
      formData.append("summary", data?.summary ?? "");
      data?.image && formData.append("image", data?.image, data?.image.name);
      formData.append("status", data?.status ?? "");
      formData.append("category_id", data?.category_id ?? "");
      formData.append("user_id", data?.user_id ?? "");

      const response = await axios.post(
        `http://localhost:3001/api/news`,
        formData
      );
      response.status === 201
        ? toast({
            title: "Enviado correctamente",
            description: response.data?.message,
          })
        : toast({
            title: "Error",
            description: response.data?.message,
          });
      cleanForm();
      setData(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {preview ? (
        <Preview
          summary={data?.summary ?? ""}
          imageURL={urlImage ?? ""}
          tags={tags ?? []}
        >
          <div className="flex flex-row justify-end gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                setPreview(false);
                form.reset(data || {});
              }}
            >
              Volver
            </Button>
            <Popup
              action={publicar}
              title="Publicar noticia"
              description="¿Deseas enviar la noticia para revisión antes de su publicación?"
              href="/noticias"
            >
              <Button>Publicar</Button>
            </Popup>
          </div>
        </Preview>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <InputForm
              name="title"
              label="Título*"
              control={form.control}
              placeholder="Escriba el título..."
              max={255}
            />

            <InputForm
              name="source"
              label="Fuente*"
              control={form.control}
              placeholder="Escriba la fuente..."
              max={64}
            />

            <InputDateForm
              name="date"
              label="Fecha*"
              control={form.control}
              placeholder="Seleccione una fecha..."
            />

            <InputTextAreaForm
              name="content"
              label="Contenido*"
              control={form.control}
              rows={10}
              placeholder="Escriba el contenido..."
            />

            <InputTextAreaForm
              name="summary"
              label="Resumen*"
              control={form.control}
              placeholder="Escriba el resumen..."
            />

            <InputForm
              name="url"
              label="URL"
              control={form.control}
              placeholder="Escriba la url..."
              max={64}
            />

            <InputSelectForm
              name="category_id"
              label="Categoría*"
              control={form.control}
              placeholder="Seleccione una categoría"
              array={categories}
            />

            <InputFileForm
              name="image"
              label="Imagen"
              control={form.control}
              ref={imageInputRef}
            />
            <InputTagsForm
              control={form.control}
              name="tags"
              label="Etiquetas"
              tags={tags}
              setTags={(newTags) => {
                setTags(newTags);
                form.setValue("tags", newTags);
              }}
            />
            <div className="flex justify-end gap-4">
              <Popup
                title="Cancelar noticia"
                description="Todos los cambios no guardados se perderán."
                action={cleanForm}
                href="/noticias"
              >
                <Button variant="outline">Cancelar</Button>
              </Popup>
              <Button type="submit"> Previsualizar </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default InputFile;
