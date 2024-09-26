/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "@/components/ui/search";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { News } from "@/components/noticias/newsInterfaces";
import ListNews from "@/components/ui/list-news";

const Noticias = () => {
    const [news, setNews] = useState<Array<News | null>>([]);
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);

    useEffect(() => {
        getSearch();
    }, [search, page]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    /**
     * Fetches news data from the API based on search query and updates the news state.
     *
     * @return {Promise<void>} Resolves when the news data has been fetched and updated.
     */
    const getSearch = async (): Promise<void> => {
        try {
            const response = await axios.get("/api/news/searching", {
                params: { search: search, page: page, limit: limit },
            });
            setNews(response.data.data);
        } catch (error) {
            console.error("Error fetching news:", error);
        }
    };
    /**
     * Fetches news data from the API and updates the news state.
     *
     * @return {Promise<void>} Resolves when the news data has been fetched and updated.
     */
    const getNews = async (): Promise<void> => {
        try {
            const response = await axios.get("/api/news");
            setNews(response.data.data);
        } catch (error) {
            console.error("Error fetching news:", error);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <Search setSearch={setSearch} placeholder="Buscar noticias..." />
            {search != "" && (
                <h3 className="font-semibold">
                    Noticias encontradas: {limit * page - (limit - 1)} -{" "}
                    {news[0] && news[0].total_count > page * limit
                        ? page * limit
                        : news[0]?.total_count}{" "}
                    / {news[0]?.total_count || 0}
                </h3>
            )}
            <ListNews news={news} />
            {page != 1 && (
                <Button onClick={() => setPage(page - 1)}>{"<"}</Button>
            )}
            {page * limit < (news[0] ? news[0].total_count : 0) && (
                <Button
                    onClick={() => {
                        setPage(page + 1);
                    }}
                >
                    {">"}
                </Button>
            )}
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" isActive>
                            2
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default Noticias;
