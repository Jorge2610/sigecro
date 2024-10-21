"use client";

import { Form } from "@/components/ui/form";
import { InputForm } from "./inputsForm";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/useSearch";

interface SearchProps {
    placeholder?: string;
    setSearch?: (value: string) => void;
    initialValue?: string;
}

const Search = ({ placeholder, setSearch, initialValue = "" }: SearchProps) => {
    const { form, onSubmit, clear } = useSearch(setSearch, initialValue);
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="flex flex-row w-full align-middle gap-0 shadow-sm">
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
