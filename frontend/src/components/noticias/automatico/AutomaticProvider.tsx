"use client";

import { createContext, SetStateAction, useState } from "react";
import { NewsData } from "../newsInterfaces";

type AutomaticProviderProps = {
    children: React.ReactNode;
    categories: any;
};

type AutomaticContextData = {
    categories: any;
    newsData: NewsData | undefined;
    setNewsData:
        | React.Dispatch<SetStateAction<NewsData | undefined>>
        | undefined;
};

const AutomaticContext = createContext<AutomaticContextData | undefined>({
    categories: null,
    newsData: undefined,
    setNewsData: undefined,
});

const AutomaticProvider = ({
    children,
    categories,
}: AutomaticProviderProps) => {
    const [newsData, setNewsData] = useState<NewsData | undefined>(undefined);
    return (
        <AutomaticContext.Provider
            value={{ categories: categories, newsData: newsData, setNewsData }}
        >
            {children}
        </AutomaticContext.Provider>
    );
};

export { AutomaticContext, AutomaticProvider };
