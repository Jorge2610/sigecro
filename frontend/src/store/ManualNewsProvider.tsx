"use client";

import { createContext, useContext, useState } from "react";
import { formManualRegister } from "@/types/registerSchemas";

interface ManualNewsProviderProps {
    children: React.ReactNode;
}

interface ManualNewsContextData {
    newsData?: formManualRegister | null;
    setNewsData?: (newsData: formManualRegister | null) => void;
    imageURL?: string | null;
    setImageURL?: (imageURL: string | null) => void;
}

const NewsManualContext = createContext<ManualNewsContextData | undefined>(
    undefined
);

const ManualNewsProvider = ({ children }: ManualNewsProviderProps) => {
    const [newsData, setNewsData] = useState<formManualRegister | null>(null);
    const [imageURL, setImageURL] = useState<string | null>(null);
    return (
        <NewsManualContext.Provider
            value={{ newsData, setNewsData, imageURL, setImageURL }}
        >
            {children}
        </NewsManualContext.Provider>
    );
};

const useManualNewsContext = (): ManualNewsContextData => {
    const context = useContext(NewsManualContext);
    if (!context) {
        throw new Error(
            "useManualNewsContext debe ser utilizado dentro de un ManualNewsProvider"
        );
    }
    return context;
};

export { NewsManualContext, ManualNewsProvider, useManualNewsContext };
