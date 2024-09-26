import { z } from "zod";
import messages from "../newsMessages.json";

const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/jpeg",
    "image/webp",
];

const FormSchema = z.object({
    title: z.string().trim().min(1, { message: messages.title.required }),
    content: z.string().trim().min(1, { message: messages.content.required }),
    date: z
        .date({ required_error: messages.date.required })
        .max(new Date(), { message: messages.date.max }),
    source: z.string().trim().min(1, { message: messages.source.required }),
    url: z
        .union([
            z.string().regex(new RegExp(/https?:\/{2}(\w+\.)+\w+\/\w*/), {
                message: messages.url.format,
            }),
            z.literal(""),
        ])
        .optional(),
    summary: z.string().trim().min(1, { message: messages.summary.required }),
    image: z
        .instanceof(File)
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: messages.image.format,
        })
        .refine((file) => file.size <= 2097152, {
            message: messages.image.size,
        })
        .optional(),
    status: z.enum(["draft", "published", "refused"]).default("published"),
    tags: z.array(z.string().trim()).optional(),
    category: z.object({
        id: z.string().trim().min(1).max(10),
        name: z.string(),
    }),
    user_id: z.string().trim().min(1).max(10),
});

type Data = z.infer<typeof FormSchema>;

/**
 * Cra un FormData a partir de los datos proporcionados de una noticia.
 *
 * @param {z.infer<typeof FormSchema>} data - Los datos que se van a incluir en el FormData.
 * @return {FormData} El FormData creado a partir de los datos.
 */
const createFormData = (data: z.infer<typeof FormSchema>): FormData => {
    const formData = new FormData();
    if (data) {
        formData.append("title", data?.title ?? "");
        formData.append("content", data?.content ?? "");
        formData.append("date", data?.date?.toLocaleString() ?? "");
        formData.append("source", data?.source ?? "");
        formData.append("url", data?.url ?? "");
        formData.append("summary", data?.summary ?? "");
        data?.image && formData.append("image", data?.image, data?.image.name);
        formData.append("status", data?.status ?? "published");
        data?.tags && formData.append("tags", JSON.stringify(data?.tags));
        formData.append("category_id", data?.category.id ?? "");
        formData.append("user_id", data?.user_id ?? "");
    }
    return formData;
};

export default FormSchema;
export { createFormData };
export type { Data };
