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

const assistedRegisterUrlSchema = z.object({
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

const batchRegisterSchema = z.object({
    urls: z
        .string()
        .min(15, { message: "EL lote de URLs ingresado no es válido." }),
    category_id: z.object({
        id: z.string().min(1).max(10),
        name: z.string(),
    }),
});

type formAsssistedRegisterUrl = z.infer<typeof assistedRegisterUrlSchema>;
type formAsssistedRecord = z.infer<typeof assistedRecordSchema>;
type formBatchRegister = z.infer<typeof batchRegisterSchema>;

export type {
    cardProps,
    formAsssistedRegisterUrl,
    formAsssistedRecord,
    formBatchRegister,
};
export { assistedRegisterUrlSchema, assistedRecordSchema, batchRegisterSchema };
