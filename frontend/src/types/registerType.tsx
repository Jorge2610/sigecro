import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES } from "./newsType";
import messages from "../components/noticias/newsMessages.json";

interface cardProps {
    icon: string;
    title: string;
    description: string;
    href: string;
    buttonText: string;
    secondHref?: string;
    secondButtonText?: string;
}

const assistedRegisterFormSchema = z.object({
    url: z.string().regex(new RegExp(/https?:\/{2}(\w+\.)+\w+\/\w*/), {
        message: "La URL ingresada no es válida",
    }),
    category_id: z.object({
        id: z.string().min(1).max(10),
        name: z.string(),
    }),
});

const assistedRecordSchema = z.object({
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
    tags: z.array(z.string().trim()).optional(),
    status: z.enum(["draft", "published", "refused"]).default("published"),
});

const automaticRecordSchema = z.object({
    title: z.string().trim().min(1, { message: messages.title.required }),
    content: z.string().trim().min(1, { message: messages.content.required }),
    date: z
        .date({ required_error: messages.date.required })
        .max(new Date(Date.now()), { message: messages.date.max }),
    source: z.string().trim().min(1, { message: messages.source.required }),
    url: z
        .union([
            z.string().regex(new RegExp(/https?:\/{2}(\w+\.)+\w+\/\w*/), {
                message: messages.url.format,
            }),
            z.literal(""),
        ])
        .optional(),
    summary: z
        .string()
        .trim()
        .min(1, { message: messages.summary.required })
        .max(768, { message: messages.summary.max }),
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

type formAsssistedRegister = z.infer<typeof assistedRegisterFormSchema>;
type formAsssistedRecord = z.infer<typeof assistedRecordSchema>;

export type { cardProps, formAsssistedRegister, formAsssistedRecord };
export { assistedRegisterFormSchema, assistedRecordSchema };
