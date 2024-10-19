import React, { useEffect, useState } from "react";
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
import { useFilter } from "@/hooks/news/useFilter";
import { FilterFormValues } from "@/types/filterType";
import { DateTimePicker } from "@/components/ui/datetime-picker";

interface FormattedItem {
    id: string;
    label: string;
}

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
    const { form, isLoading, onSubmit, categories, sources, tags, clear } =
        useFilter(isAdvanced, onFilterSubmit, setIsVisible);

    if (isLoading) {
        return <div>Cargando filtros...</div>;
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
                    <div className="flex flex-col items-center gap-4 ">
                        <FormControl className="w-full">
                            <DateTimePicker
                                value={field.value?.from}
                                onChange={(date) => field.onChange({ ...field.value, from: date })}
                                placeholder="Fecha inicial"
                                granularity="day"
                                displayFormat={{ hour24: "dd-MM-yyyy" }}
                            />
                        </FormControl>
                        <FormControl>
                            <DateTimePicker
                                value={field.value?.to}
                                onChange={(date) => field.onChange({ ...field.value, to: date })}
                                placeholder="Fecha final"
                                granularity="day"
                                displayFormat={{ hour24: "dd-MM-yyyy" }}
                            />
                        </FormControl>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};


export default Filters;
