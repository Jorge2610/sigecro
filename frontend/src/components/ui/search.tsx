"use client";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { InputForm } from "../noticias/manual/InputFormText";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    search: z.string().trim(),
});

const Search = ({
    placeholder,
    setSearch,
}: {
    placeholder?: string;
    setSearch: React.Dispatch<React.SetStateAction<any>>;
}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: "",
        },
    });

    /**
     * Handles the submission of the search form.
     *
     * @param {z.infer<typeof formSchema>} data - The validated form data.
     * @return {void} None
     */
    const onSubmit = (data: z.infer<typeof formSchema>): void => {
        setSearch(data.search);
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-row w-full align-middle gap-0">
                        <InputForm
                            control={form.control}
                            name="search"
                            className="rounded-e-none border-e-0 focus-visible:ring-0  w-full"
                            placeholder={placeholder}
                        />
                        <Button
                            type="submit"
                            size={"sm"}
                            className="h-9 rounded-s-none border-s-0"
                        >
                            <span className="material-symbols-outlined">
                                search
                            </span>
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
};

export { Search };
