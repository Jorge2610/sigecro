import { getNewsBySearch } from "@/lib/api/news";
import { AdvancedFilter } from "@/types/advancedSearchType";
import { News } from "@/types/newsType";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const useNewsPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [news, setNews] = useState<News[]>([]);
    const [search, setSearch] = useState<string>(
        searchParams.get("search") || ""
    );
    const [page, setPage] = useState<number>(
        Number(searchParams.get("page")) || 1
    );
    const [limit, setLimit] = useState<number>(
        Number(searchParams.get("limit")) || 10
    );
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isAdvancedSearch, setIsAdvacedSearch] = useState<boolean>(false);
    const [advancedSearch, setAdvancedSearch] = useState<AdvancedFilter[]>(
        () => {
            const savedFilter = searchParams.get("filter");
            return savedFilter ? JSON.parse(savedFilter) : [];
        }
    );
    const [isFilter, setIsFilter] = useState<boolean>(false);
    const [filterCategories, setFilterCategories] = useState<number[] | null>(
        null
    );
    const [sort, setSort] = useState<number>(0);
    const [filterTags, setFilterTags] = useState<string[] | null>(null);
    const [filterSources, setFilterSources] = useState<string[] | null>(null);
    const [filterDateStart, setFilterDateStart] = useState<Date | null>(null);
    const [filterDateEnd, setFilterDateEnd] = useState<Date | null>(null);
    const [viewList, setViewList] = useState<boolean>(false);

    useEffect(() => {
        getSearch();
    }, [
        search,
        advancedSearch,
        page,
        sort,
        limit,
        filterTags,
        filterSources,
        filterDateStart,
        filterDateEnd,
    ]);

    useEffect(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("search", search);
        newParams.set("page", page.toString());
        newParams.set("limit", limit.toString());
        router.replace(`?${newParams.toString()}`, { scroll: true });
    }, [search, page, limit]);

    useEffect(() => {
        !isAdvancedSearch && setAdvancedSearch([]);
    }, [isAdvancedSearch]);

    const getSearch = async (): Promise<void> => {
        try {
            const params = {
                ...(isAdvancedSearch
                    ? { filters: JSON.stringify(advancedSearch), search: "" }
                    : { search }),
                page,
                limit,
                sort,
                filterCategories: JSON.stringify(filterCategories),
                filterDateStart: filterDateStart?.toISOString() || null,
                filterDateEnd: filterDateEnd?.toISOString() || null,
                filterSources: JSON.stringify(filterSources),
                filterTags: JSON.stringify(filterTags),
            };
            const response = await getNewsBySearch(params);
            setNews(response);
            setTotalPages(Math.ceil(response[0]?.total_count / limit) || 1);
        } catch (error) {
            console.error("Error fetching news:", error);
            setTotalPages(1);
        }
    };

    const changeView = (value: boolean) => {
        setViewList(value);
    };
    const handleFilter = (
        categories: number[] | null,
        tags: string[] | null,
        sources: string[] | null,
        dateStart: Date | null,
        dateEnd: Date | null
    ) => {
        setFilterCategories(categories);
        setFilterTags(tags);
        setFilterSources(sources);
        setFilterDateStart(dateStart);
        setFilterDateEnd(dateEnd);
        setPage(1);
        setIsFilter(true);
    };

    const handleSort = (sort: string) => {
        setSort(() => Number.parseInt(sort));
        setPage(1);
    };

    const handleLimit = (limit: string) => {
        setLimit(() => Number.parseInt(limit));
        setPage(1);
    };

   
    const handleSearch = (newSearch: string): void => {
        setIsAdvacedSearch(false);
        setSearch(newSearch);
        setAdvancedSearch([]);
        setPage(1);
    };

    const handleAdvancedSearch = (filters: AdvancedFilter[]): void => {
        setAdvancedSearch(filters);
        setIsAdvacedSearch(true);
        setSearch("");
        setPage(1);
    };

    
    const handlePageChange = (newPage: number): void => {
        setPage(newPage);
    };

    const foundNews = (): string => {
        if (news.length === 0) return "0";
        return `${limit * (page - 1) + 1} - 
                    ${Math.min(page * limit, news[0]?.total_count || 0)}
                    / ${news[0]?.total_count || 0}`;
    };

    return {
        totalPages,
        handlePageChange,
        page,
        setIsAdvacedSearch,
        isAdvancedSearch,
        advancedSearch,
        handleAdvancedSearch,
        handleSearch,
        viewList,
        isFilter,
        setIsFilter,
        handleFilter,
        handleSort,
        changeView,
        handleLimit,
        search,
        foundNews,
        news,
    };
};

const usePaginationNews = (setPage: (value: number) => void) => {
    const handlePageChange = (newPage: number): void => {
        setPage(newPage);
    };

    return {
        handlePageChange,
    };
};

export { useNewsPage, usePaginationNews };
