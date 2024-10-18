import { z } from "zod";

const ERROR_MESSAGES = {
    name_min: "El nombre no puede estar vacío",
    name_max: "El nombre no puede tener mas de 64 caracteres",
    description_max: "La descripción no puede tener mas de 500 caracteres",
};

interface CategoryType {
    id: string;
    name: string;
    description?: string;
}

const categorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, {
            message: ERROR_MESSAGES.name_min,
        })
        .max(64, {
            message: ERROR_MESSAGES.name_max,
        }),
    description: z.string().max(500, {
        message: ERROR_MESSAGES.description_max,
    }),
});

type CategoryForm = z.infer<typeof categorySchema>;

export type { CategoryType, CategoryForm };
export { categorySchema };
