import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { NewsData } from "../newsInterfaces";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ACCEPTED_IMAGE_TYPES, MESSAGES } from "../newsInterfaces";
import Popup from "../../ui/popup";
import {
  InputTextAreaForm,
  InputSelectForm,
  InputFileForm,
} from "../manual/InputFormText";
import axios from "axios";
import { useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function AutomaticPreview({ newsData }: { newsData: NewsData }) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const formSchema = z.object({
    summary: z.string().min(1, { message: MESSAGES.summary.required }),
    image: z
      .instanceof(File)
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: MESSAGES.image.format,
      })
      .refine((file) => file.size <= 2097152, {
        message: MESSAGES.image.size,
      })
      .optional(),
    category_id: z.string().min(1).max(10),
  });

  type Data = {
    id: string;
    name: string;
  };
  const categories: null | Data[] = [{ id: "1", name: "Categoría 1" }];
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      summary: "",
      image: undefined,
      category_id: "1",
    },
  });

  const getFormatedContent = () => {
    let formatedContent: string = "";
    newsData.content.map((paragraph) => {
      formatedContent += paragraph + "\n\n";
    });
    return formatedContent;
  };

  const getFormData = (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("title", newsData.title);
    formData.append("content", getFormatedContent());
    formData.append("date", newsData.dateTime.toISOString());
    formData.append("source", newsData.source);
    formData.append("url", newsData.url);
    formData.append("summary", data?.summary ?? "");
    data?.image && formData.append("image", data?.image, data?.image.name);
    formData.append("status", "draft");
    formData.append("category_id", data?.category_id ?? "");
    formData.append("user_id", "1");
    return formData;
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const formData = getFormData(data);
      const response = await axios.post(`/api/news`, formData);
      response.status === 201
        ? toast({
            title: "Enviado correctamente",
            description: response.data?.message,
          })
        : toast({
            title: "Error",
            description: response.data?.message,
          });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <a href={newsData.url} target="_blank" className="underline">
        {newsData.url}
      </a>
      <h2 className="text-3xl font-lora font-medium">{newsData.title}</h2>
      <div className="flex items-center">
        <span className="material-symbols-outlined text-sig-text mr-2">
          newspaper
        </span>
        {newsData.source}
        <span className="material-symbols-outlined text-sig-text ml-4 mr-2">
          calendar_clock
        </span>
        {format(newsData.dateTime, "dd-MM-yyyy HH:mm")}
      </div>
      <div>
        {newsData.content.map((paragraph, i) => {
          return (
            <p className="mb-4" key={i}>
              {paragraph}
            </p>
          );
        })}
      </div>
      <Separator className="mt-[-1rem]" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <InputSelectForm
            name="category_id"
            label="Categoría*"
            control={form.control}
            placeholder="Seleccione una categoría"
            array={categories}
          />
          <InputTextAreaForm
            name="summary"
            label="Resumen*"
            control={form.control}
            placeholder="Escriba el resumen..."
          />
          <InputFileForm
            name="image"
            label="Imagen"
            control={form.control}
          />
          <div className="flex justify-end gap-4">
            <Popup
              title="Cancelar registro"
              description="Todos los cambios no guardados se perderán."
              href="/administrar-noticias"
            >
              <Button variant="outline">Cancelar</Button>
            </Popup>
            <Button type="submit"> Publicar </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
