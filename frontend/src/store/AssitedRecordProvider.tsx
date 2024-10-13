"use client";

import { createContext, SetStateAction, useState } from "react";
import { AssistedRecordNews } from "../types/newsType";
import { CategoryType } from "@/types/categoryType";

type AssistedRecordProviderProps = {
    children: React.ReactNode;
    categories?: CategoryType[];
};

type AssistedRecordContextData = {
    categories?: CategoryType[];
    newsData: AssistedRecordNews;
    setNewsData: React.Dispatch<SetStateAction<AssistedRecordNews>>;
};

const emptyNewsData = {
    category_id: "",
    content: [],
    date: new Date(Date.now()),
    source: "",
    title: "",
    url: "",
};

const AssistedRecordContext = createContext<AssistedRecordContextData>({
    categories: undefined,
    newsData: emptyNewsData,
    setNewsData: useState<AssistedRecordNews>,
});

const AssistedRecordProvider = ({
    children,
    categories,
}: AssistedRecordProviderProps) => {
    const [newsData, setNewsData] = useState<AssistedRecordNews>(emptyNewsData);
    return (
        <AssistedRecordContext.Provider
            value={{ categories: categories, newsData: newsData, setNewsData }}
        >
            {children}
        </AssistedRecordContext.Provider>
    );
};

export { AssistedRecordContext, AssistedRecordProvider };
