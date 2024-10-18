"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "@/components/ui/search";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import Searching from "@/components/noticias/search/Searching";
import AdvancedSearch from "@/components/noticias/search/AdvancedSearch";
import { News } from "@/types/newsType";
import ListNews from "@/components/ui/list-news";
import Filters from "@/components/noticias/search/Filters";
import Sorting from "@/components/noticias/search/Sorting";

type Operator = "" | "NOT";

interface FilterCondition {
    [field: string]: {
        value: string;
        operator: Operator;
    };
}

interface AdvancedFilter {
    conditions: FilterCondition;
    logic: string;
}

const Noticias = () => {
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
    const [isAdvacedSearch, setIsAdvacedSearch] = useState<boolean>(false);
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
        !isAdvacedSearch && setAdvancedSearch([]);
    }, [isAdvacedSearch]);

    /**
     * Fetches news data from the API based on search query and updates the news state.
     *
     * @return {Promise<void>} Resolves when the news data has been fetched and updated.
     */
    const getSearch = async (): Promise<void> => {
        try {
            const params = isAdvacedSearch
                ? {
                      filters: JSON.stringify(advancedSearch),
                      search: "",
                      page,
                      limit,
                      sort,
                      filterCategories: JSON.stringify(filterCategories),
                      filterDateStart: filterDateStart
                          ? filterDateStart.toISOString()
                          : null,
                      filterDateEnd: filterDateEnd
                          ? filterDateEnd.toISOString()
                          : null,
                      filterSources: JSON.stringify(filterSources),
                      filterTags: JSON.stringify(filterTags),
                  }
                : {
                      search,
                      page,
                      limit,
                      sort,
                      filterCategories: JSON.stringify(filterCategories),
                      filterDateStart: filterDateStart
                          ? filterDateStart.toISOString()
                          : null,
                      filterDateEnd: filterDateEnd
                          ? filterDateEnd.toISOString()
                          : null,
                      filterSources: JSON.stringify(filterSources),
                      filterTags: JSON.stringify(filterTags),
                  };
            const response = await axios.get("/api/news/searching", {
                params,
            });
            setNews(response.data.data);
            setTotalPages(
                Math.ceil(response.data.data[0]?.total_count / limit) || 1
            );
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

    /**
     * Updates the search query and resets the page number to 1.
     *
     * @param {string} newSearch - The new search query to update.
     * @return {void} No return value.
     */
    const handleSearch = (newSearch: string): void => {
        setIsAdvacedSearch(false);
        setSearch(newSearch);
        setAdvancedSearch([]);
        setPage(1);
    };

    /**
     * Updates the search query with the given advanced filters and resets the page number to 1.
     *
     * @param {AdvancedFilter[]} filters - The advanced filters to update the search query with.
     * @return {void} No return value.
     */
    const handleAdvancedSearch = (filters: AdvancedFilter[]): void => {
        setAdvancedSearch(filters);
        setIsAdvacedSearch(true);
        setSearch("");
        setPage(1);
    };

    /**
     * Updates the current page with the given new page number.
     *
     * @param {number} newPage - The new page number to set.
     * @return {void} This function does not return anything.
     */
    const handlePageChange = (newPage: number): void => {
        setPage(newPage);
    };

    /**
     * Renders pagination items based on the total number of pages and the current page.
     *
     * If the total number of pages is less than or equal to the maximum visible pages,
     * it renders all pages. Otherwise, it renders the first page, an ellipsis, the pages
     * around the current page, another ellipsis (if necessary), and the last page.
     *
     * @return {React.JSX.Element[]} An array of pagination items.
     */
    const renderPaginationItems = (): React.JSX.Element[] => {
        let items = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => handlePageChange(i)}
                            isActive={page === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            const leftBound = Math.max(
                1,
                page - Math.floor(maxVisiblePages / 2)
            );
            const rightBound = Math.min(
                totalPages,
                leftBound + maxVisiblePages - 1
            );

            if (leftBound > 1) {
                items.push(
                    <PaginationItem key={1}>
                        <PaginationLink onClick={() => handlePageChange(1)}>
                            1
                        </PaginationLink>
                    </PaginationItem>
                );
                if (leftBound > 2) {
                    items.push(<PaginationEllipsis key="leftEllipsis" />);
                }
            }

            for (let i = leftBound; i <= rightBound; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => handlePageChange(i)}
                            isActive={page === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (rightBound < totalPages) {
                if (rightBound < totalPages - 1) {
                    items.push(<PaginationEllipsis key="rightEllipsis" />);
                }
                items.push(
                    <PaginationItem key={totalPages}>
                        <PaginationLink
                            onClick={() => handlePageChange(totalPages)}
                        >
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }

        return items;
    };

    return (
        <div className="flex flex-col gap-4">
            <Searching
                setIsAdvanced={setIsAdvacedSearch}
                isAdvanced={isAdvacedSearch}
            >
                {isAdvacedSearch ? (
                    <AdvancedSearch
                        filters={advancedSearch}
                        onSearch={handleAdvancedSearch}
                    />
                ) : (
                    <Search
                        setSearch={handleSearch}
                        placeholder="Buscar noticias..."
                    />
                )}
            </Searching>
            <Sorting
                viewList={viewList}
                isFilters={isFilter}
                setFilters={setIsFilter}
                onAmountSubmit={handleLimit}
                onSortSubmit={handleSort}
                setViewList={changeView}
            />

            <div className="lg:flex lg:flex-col lg:gap-4 lg:w-full">
                <div className="lg:flex lg:flex-row lg:gap-4">
                    <Filters
                        isAdvanced={isAdvacedSearch}
                        setIsVisible={setIsFilter}
                        isVisible={isFilter}
                        onFilterSubmit={handleFilter}
                    />
                    <div className="flex flex-col gap-4 w-full">
                        {(search != "" || advancedSearch.length > 0) && (
                            <h4 className="font-semibold">
                                Noticias encontradas:{" "}
                                {news.length > 0
                                    ? `${limit * (page - 1) + 1} - 
                    ${Math.min(page * limit, news[0]?.total_count || 0)}
                    / ${news[0]?.total_count || 0}`
                                    : "0"}
                            </h4>
                        )}
                        <ListNews news={news} viewList={viewList} />
                    </div>
                </div>
                <Pagination>
                    <PaginationContent>
                        {page > 1 && (
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        handlePageChange(Math.max(1, page - 1))
                                    }
                                />
                            </PaginationItem>
                        )}
                        {renderPaginationItems()}
                        {page < totalPages && (
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        handlePageChange(
                                            Math.min(totalPages, page + 1)
                                        )
                                    }
                                />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export default Noticias;
