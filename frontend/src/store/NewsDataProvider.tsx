"use client";

import { createContext, useState, useContext } from "react";
import { NewsData } from "@/types/newsType";

type NewsContextType = {
    newsData: NewsData;
    updateNewsData: (newsData: NewsData) => void;
    resetNewsData: () => void;
};

const emptyNewsData: NewsData = {
    category_id: "",
    category_name: "",
    content: [],
    date: new Date("2000-01-01"),
    source: "",
    status: "",
    summary: "",
    title: "",
    user_id: "",
};

const NewsDataContext = createContext<NewsContextType>({
    newsData: emptyNewsData,
    updateNewsData: () => {},
    resetNewsData: () => {},
});

const useNewsDataContext = () => {
    const context = useContext(NewsDataContext);
    return context;
};

type NewsDataProviderProps = {
    children: React.ReactNode;
};

const NewsDataProvider = ({ children }: NewsDataProviderProps) => {
    const [newsData, setNewsData] = useState<NewsData>(emptyNewsData);

    const updateNewsData = (newsData: NewsData) => {
        setNewsData((_) => newsData);
    };

    const resetNewsData = () => {
        setNewsData((_) => emptyNewsData);
    };

    return (
        <NewsDataContext.Provider
            value={{ newsData: newsData, updateNewsData, resetNewsData }}
        >
            {children}
        </NewsDataContext.Provider>
    );
};

export { NewsDataProvider, useNewsDataContext };
