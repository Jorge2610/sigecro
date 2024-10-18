import { z } from "zod";
import {
    summary,
    image,
    batchRegister,
    title,
    content,
    date,
    source,
    url,
} from "@/data/newsMessages";

const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/jpeg",
    "image/webp",
];

const assistedRegisterUrlSchema = z.object({
    url: z.string().regex(new RegExp(/https?:\/{2}(\w+\.)+\w+\/\w*/), {
        message: "La URL ingresada no es válida",
    }),
    category: z.object({
        id: z.string(),
        name: z.string(),
    }),
});

const assistedRecordSchema = z.object({
    summary: z.string().trim().min(1, { message: summary.required }),
    image: z
        .instanceof(File)
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: image.format,
        })
        .refine((file) => file.size <= 2097152, {
            message: image.size,
        })
        .optional(),
    tags: z.array(z.string().trim()).optional(),
});

const batchRegisterSchema = z.object({
    urls: z.string().min(15, { message: batchRegister.error }),
    category: z.object({
        id: z.string(),
        name: z.string(),
    }),
});

const manualRegisterSchema = z.object({
    title: z.string().trim().min(1, { message: title.required }),
    content: z.string().trim().min(1, { message: content.required }),
    date: z
        .date({ required_error: date.required })
        .max(new Date(Date.now()), { message: date.max }),
    source: z.string().trim().min(1, { message: source.required }),
    url: z
        .union([
            z.string().regex(new RegExp(/https?:\/{2}(\w+\.)+\w+\/\w*/), {
                message: url.format,
            }),
            z.literal(""),
        ])
        .optional(),
    summary: z
        .string()
        .trim()
        .min(1, { message: summary.required })
        .max(768, { message: summary.max }),
    image: z
        .instanceof(File)
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: image.format,
        })
        .refine((file) => file.size <= 2097152, {
            message: image.size,
        })
        .optional(),
    tags: z.array(z.string().trim()).optional(),
    category: z.object({
        id: z.string(),
        name: z.string(),
    }),
});

type formAsssistedRegisterUrl = z.infer<typeof assistedRegisterUrlSchema>;
type formAsssistedRecord = z.infer<typeof assistedRecordSchema>;
type formBatchRegister = z.infer<typeof batchRegisterSchema>;
type formManualRegister = z.infer<typeof manualRegisterSchema>;

export type {
    formAsssistedRegisterUrl,
    formAsssistedRecord,
    formBatchRegister,
    formManualRegister,
};

export {
    assistedRegisterUrlSchema,
    assistedRecordSchema,
    batchRegisterSchema,
    manualRegisterSchema,
};
