import { getUsedCategories } from "@/lib/api/categories";
import { getSourcesNews } from "@/lib/api/news";
import { getMostUsedTags } from "@/lib/api/tags";
import { CategoryType } from "@/types/categoryType";
import { FilterFormValues, FormFilterSchema } from "@/types/filterType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FormattedItem {
    id: string;
    label: string;
}

type onFilterSubmit = (
    categories: number[] | null,
    tags: string[] | null,
    sources: string[] | null,
    dateStart: Date | null,
    dateEnd: Date | null
) => void;

const useFilter = (
    isAdvanced: boolean,
    onFilterSubmit: onFilterSubmit,
    setIsVisible: (value: boolean) => void
) => {
    const [categories, setCategories] = useState<FormattedItem[]>([]);
    const [sources, setSources] = useState<FormattedItem[]>([]);
    const [tags, setTags] = useState<FormattedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<FilterFormValues>({
        resolver: zodResolver(FormFilterSchema),
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
            return [];
        }
        return data.map(formatFn);
    };

    const getCategories = async () => {
        try {
            const response = await getUsedCategories();
            const formattedCategories = formatData(
                response,
                (category: CategoryType) => ({
                    id: category.id,
                    label: category.name,
                })
            );
            setCategories(formattedCategories);
        } catch (error) {
            setCategories([]);
        }
    };

    const getSources = async () => {
        try {
            const response = await getSourcesNews();
            const sourcesArray = Array.isArray(response)
                ? response
                : Object.keys(response || {}).map((key) => ({
                      source: key,
                  }));

            const formattedSources = formatData(
                sourcesArray,
                (source: { source: string }) => ({
                    id: source.source,
                    label: source.source,
                })
            );
            setSources(formattedSources);
        } catch (error) {
            setSources([]);
        }
    };

    const getTags = async () => {
        try {
            const response = await getMostUsedTags();
            const formattedTags = formatData(
                response,
                (tag: { name: string }) => ({
                    id: tag.name,
                    label: tag.name,
                })
            );
            setTags(formattedTags);
        } catch (error) {
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

    return { form, isLoading, onSubmit, categories, sources, tags, clear };
};
export { useFilter };
