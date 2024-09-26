"use client";
import { createContext, SetStateAction, useState } from "react";
import { Data } from "./formSchema";

interface ManualNewsProviderProps {
    children: React.ReactNode;
}

interface ManualNewsContextData {
    newsData: Data | null;
    setNewsData:
        | React.Dispatch<SetStateAction<Data | null>>
        | undefined;
    imageURL: string | null;
    setImageURL: React.Dispatch<SetStateAction<string | null>> | undefined;
}

const NewsManualContext = createContext<ManualNewsContextData | undefined>({
    newsData: null,
    setNewsData: undefined,
    imageURL: null,
    setImageURL: undefined,
});

const ManualNewsProvider = ({ children }: ManualNewsProviderProps) => {
    const [newsData, setNewsData] = useState<Data | null>(null);
    const [imageURL, setImageURL] = useState<string | null>(null);
    return (
        <NewsManualContext.Provider
            value={{ newsData, setNewsData, imageURL, setImageURL }}
        >
            {children}
        </NewsManualContext.Provider>
    );
};

export { NewsManualContext, ManualNewsProvider };
