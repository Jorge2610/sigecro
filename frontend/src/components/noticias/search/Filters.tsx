/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

interface Category {
    id: string;
    name: string;
}

interface Source {
    source: string;
}

interface Tag {
    id: string;
    name: string;
}

interface FormattedItem {
    id: string;
    label: string;
}

const FormSchema = z.object({
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
                message:
                    "La fecha final no puede ser anterior a la fecha inicial",
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
                message:
                    "La fecha inicial no puede ser posterior a la fecha final",
                path: ["from"],
            }
        ),
});

type FilterFormValues = z.infer<typeof FormSchema>;
interface FilterProps {
    isVisible: boolean;
    isAdvanced: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    onFilterSubmit: (
        categories: number[] | null,
        tags: string[] | null,
        sources: string[] | null,
        dateStart: Date | null,
        dateEnd: Date | null
    ) => void;
}
const Filters = ({
    isVisible,
    isAdvanced,
    setIsVisible,
    onFilterSubmit,
}: FilterProps) => {
    const [categories, setCategories] = useState<FormattedItem[]>([]);
    const [sources, setSources] = useState<FormattedItem[]>([]);
    const [tags, setTags] = useState<FormattedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<FilterFormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            categories: [],
            sources: [],
            tags: [],
            dateRange: {
                from: undefined,
                to: undefined,
            },
        },
    });

    useEffect(() => {
        Promise.all([getCategories(), getSources(), getTags()]).finally(() =>
            setIsLoading(false)
        );
    }, []);

    useEffect(() => {
        clear();
    }, [isAdvanced]);

    const formatData = <T extends unknown>(
        data: T[] | undefined,
        formatFn: (item: T) => FormattedItem
    ): FormattedItem[] => {
        if (!Array.isArray(data)) {
            console.warn("Expected array, got:", typeof data);
            return [];
        }
        return data.map(formatFn);
    };

    const getCategories = async () => {
        try {
            const response = await axios.get<Category[]>(
                "/api/categories/filters"
            );
            const formattedCategories = formatData(
                response.data,
                (category: Category) => ({
                    id: category.id,
                    label: category.name,
                })
            );
            setCategories(formattedCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        }
    };

    const getSources = async () => {
        try {
            const response = await axios.get<{ data: Source[] }>(
                "/api/news/sources"
            );
            const sourcesArray = Array.isArray(response.data.data)
                ? response.data.data
                : Object.keys(response.data.data || {}).map((key) => ({
                      source: key,
                  }));

            const formattedSources = formatData(
                sourcesArray,
                (source: Source) => ({
                    id: source.source,
                    label: source.source,
                })
            );
            setSources(formattedSources);
        } catch (error) {
            console.error("Error fetching sources:", error);
            setSources([]);
        }
    };

    const getTags = async () => {
        try {
            const response = await axios.get<Tag[]>("/api/news/tags/filters");
            const formattedTags = formatData(response.data, (tag: Tag) => ({
                id: tag.name,
                label: tag.name,
            }));
            setTags(formattedTags);
        } catch (error) {
            console.error("Error fetching tags:", error);
            setTags([]);
        }
    };

    const onSubmit = (data: FilterFormValues) => {
        onFilterSubmit(
            data.categories.length > 0
                ? data.categories.map((category) => parseInt(category))
                : null,
            data.tags.length > 0 ? data.tags : null,
            data.sources.length > 0 ? data.sources : null,
            data.dateRange.from ? data.dateRange.from : null,
            data.dateRange.to ? data.dateRange.to : null
        );
    };

    const clear = () => {
        form.reset();
        setIsVisible(false);
        onFilterSubmit(null, null, null, null, null);
    };

    if (isLoading) {
        return <div>Loading filters...</div>;
    }

    return (
        <div
            className={`${
                isVisible ? "block" : "hidden"
            } flex flex-col gap-4 w-full bg-white p-4 rounded-lg truncate lg:w-1/5`}
        >
            <div className="flex justify-between items-center">
                <p className="flex items-center gap-2 font-semibold text-sig-blue">
                    <span className="material-symbols-outlined">
                        filter_list
                    </span>
                    Filtros
                </p>
                <Button
                    variant="ghost"
                    className="w-4 h-7 hover:bg-sig-red hover:text-white"
                    onClick={() => setIsVisible(false)}
                >
                    <span className="material-symbols-outlined">close</span>
                </Button>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 "
                >
                    {categories.length > 0 && (
                        <SectionFilter
                            title="Categorías"
                            items={categories}
                            name="categories"
                            form={form}
                        />
                    )}
                    {sources.length > 0 && (
                        <SectionFilter
                            title="Fuentes"
                            items={sources}
                            name="sources"
                            form={form}
                        />
                    )}

                    {!isAdvanced && tags.length > 0 && (
                        <SectionFilter
                            title="Etiquetas populares"
                            items={tags}
                            name="tags"
                            form={form}
                        />
                    )}
                    <DateRangeFilter form={form} />
                    <div className="flex flex-wrap justify-end lg:justify-center gap-4">
                        <Button variant="ghost" onClick={clear}>
                            Limpiar filtros
                        </Button>
                        <Button
                            type="submit"
                            onKeyDown={(e) => e.key === "Enter"}
                        >
                            Aplicar filtros
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

interface SectionFilterProps {
    title: string;
    items: FormattedItem[];
    name: keyof FilterFormValues;
    form: any;
}

const SectionFilter = ({ title, items, name, form }: SectionFilterProps) => {
    const [maxItems, setMaxItems] = useState<number>(5);

    useEffect(() => {
        if (maxItems > items.length) {
            setMaxItems(items.length);
        }
    }, [maxItems]);

    return (
        <>
            <FormField
                control={form.control}
                name={name}
                render={() => (
                    <FormItem>
                        <div className="w-full truncate" title={title}>
                            <FormLabel className="text-base font-medium w-full truncate">
                                {title}
                            </FormLabel>
                        </div>
                        {items.map(
                            (item, index) =>
                                index < maxItems && (
                                    <FormField
                                        key={item.id}
                                        control={form.control}
                                        name={name}
                                        render={({ field }) => (
                                            <FormItem
                                                key={item.id}
                                                className="flex flex-row items-start space-x-3 space-y-0 w-full "
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(
                                                            item.id
                                                        )}
                                                        onCheckedChange={(
                                                            checked
                                                        ) => {
                                                            return checked
                                                                ? field.onChange(
                                                                      [
                                                                          ...field.value,
                                                                          item.id,
                                                                      ]
                                                                  )
                                                                : field.onChange(
                                                                      field.value?.filter(
                                                                          (
                                                                              value: string
                                                                          ) =>
                                                                              value !==
                                                                              item.id
                                                                      )
                                                                  );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel
                                                    className="text-sm font-normal w-full truncate text-nowrap"
                                                    title={item.label}
                                                >
                                                    {item.label}
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                )
                        )}
                        {maxItems < items.length && (
                            <div className="flex justify-end m-0">
                                <span
                                    className="hover:text-sig-bluesky"
                                    onClick={() => setMaxItems(maxItems + 5)}
                                >
                                    Ver más
                                </span>
                            </div>
                        )}
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Separator />
        </>
    );
};

const DateRangeFilter = ({ form }: { form: any }) => {
    return (
        <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel
                        className="text-base font-medium w-full truncate"
                        title="Rango de fechas"
                    >
                        Rango de fechas
                    </FormLabel>
                    <div className="flex flex-col items-center gap-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value?.from &&
                                                "text-muted-foreground"
                                        )}
                                    >
                                        {field.value?.from ? (
                                            format(field.value.from, "P")
                                        ) : (
                                            <span>Fecha inicial</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={field.value?.from}
                                    onSelect={(date) =>
                                        field.onChange({
                                            ...field.value,
                                            from: date,
                                        })
                                    }
                                    disabled={(date) =>
                                        date > new Date() ||
                                        (field.value?.to
                                            ? date > field.value.to
                                            : false)
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value?.to &&
                                                "text-muted-foreground"
                                        )}
                                    >
                                        {field.value?.to ? (
                                            format(field.value.to, "P")
                                        ) : (
                                            <span>Fecha final</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={field.value?.to}
                                    onSelect={(date) =>
                                        field.onChange({
                                            ...field.value,
                                            to: date,
                                        })
                                    }
                                    disabled={(date) =>
                                        date > new Date() ||
                                        (field.value?.from
                                            ? date < field.value.from
                                            : false)
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default Filters;
