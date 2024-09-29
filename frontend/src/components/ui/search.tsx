"use client";

import React, { useEffect } from "react";
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
    initialValue = "",
}: {
    placeholder?: string;
    setSearch: React.Dispatch<React.SetStateAction<string> | any>;
    initialValue?: string;
}) => {
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="flex flex-row w-full align-middle gap-0">
                    <InputForm
                        control={form.control}
                        name="search"
                        className="rounded-e-none border-e-0 focus-visible:ring-0 w-full"
                        placeholder={placeholder}
                    />
                    {form.watch("search") && (
                        <Button
                            type="button"
                            onClick={clear}
                            variant={"outline"}
                            size={"sm"}
                            className="h-9 rounded-none border-s-0 border-e-0 hover:bg-white hover:text-sig-purple"
                        >
                            <span className="material-symbols-outlined">
                                close
                            </span>
                        </Button>
                    )}
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
    );
};

export { Search };
