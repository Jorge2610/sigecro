import { z } from "zod";

const DATE_MESSAGES = {
    to: "La fecha final no puede ser anterior a la fecha inicial",
    from: "La fecha inicial no puede ser posterior a la fecha final",
};

const FormFilterSchema = z.object({
    categories: z.array(z.string()).default([]),
    sources: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    dateRange: z
        .object({
            from: z.date().optional(),
            to: z.date().optional(),
        })
        .refine(
            (data) => {
                if (data.from && data.to) {
                    return data.to >= data.from;
                }
                return true;
            },
            {
                message: DATE_MESSAGES.to,
                path: ["to"],
            }
        )
        .refine(
            (data) => {
                if (data.to && data.from) {
                    return data.from <= data.to;
                }
                return true;
            },
            {
                message: DATE_MESSAGES.from,
                path: ["from"],
            }
        ),
});
type FilterFormValues = z.infer<typeof FormFilterSchema>;

export type { FilterFormValues };
export { FormFilterSchema };
