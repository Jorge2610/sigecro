import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    search: z.string().trim(),
});

const useSearch = (setSearch = (value: string) => {}, initialValue: string) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: initialValue,
        },
    });

    useEffect(() => {
        form.setValue("search", initialValue);
    }, [initialValue, form]);

    const onSubmit = (data: z.infer<typeof formSchema>): void => {
        setSearch(data.search);
    };

    const clear = () => {
        form.reset({ search: "" });
        setSearch("");
    };

    return { form, onSubmit, clear };
};

export { useSearch };
