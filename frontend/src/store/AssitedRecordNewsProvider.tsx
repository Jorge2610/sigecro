"use client";

import { createContext, SetStateAction, useState } from "react";
import { NewsData } from "../types/newsType";
import { CategoryType } from "@/types/categoryType";

type AutomaticProviderProps = {
    children: React.ReactNode;
    categories?: CategoryType[];
};

type AutomaticContextData = {
    categories?: CategoryType[];
    newsData: NewsData;
    setNewsData: React.Dispatch<SetStateAction<NewsData>>;
};

const emptyNewsData = {
    category_id: "",
    content: [],
    dateTime: new Date(Date.now()),
    source: "",
    title: "",
    url: "",
};

const AutomaticContext = createContext<AutomaticContextData>({
    categories: undefined,
    newsData: emptyNewsData,
    setNewsData: useState<NewsData>,
});

const AutomaticProvider = ({
    children,
    categories,
}: AutomaticProviderProps) => {
    const [newsData, setNewsData] = useState<NewsData>(emptyNewsData);
    return (
        <AutomaticContext.Provider
            value={{ categories: categories, newsData: newsData, setNewsData }}
        >
            {children}
        </AutomaticContext.Provider>
    );
};

export { AutomaticContext, AutomaticProvider };
