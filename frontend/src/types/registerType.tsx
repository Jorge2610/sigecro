import { z } from "zod";

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

type formAsssistedRegister = z.infer<typeof assistedRegisterFormSchema>;

export type { cardProps, formAsssistedRegister };
export { assistedRegisterFormSchema };
