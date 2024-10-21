import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const labels = {
    item1: "Búsqueda",
    item2: "Búsqueda Avanzada",
};

interface SearchContainerProps {
    setIsAdvanced: (value: boolean) => void;
    isAdvanced: boolean;
    children?: React.ReactNode;
}

const SearchContainer = ({
    children,
    setIsAdvanced,
    isAdvanced,
}: SearchContainerProps) => {
    return (
        <div className="w-full bg-white rounded-xl p-0 m-0">
            <div className="flex justify-center flex-nowrap">
                <ButtonSearch
                    setIsAdvanced={setIsAdvanced}
                    isAdvanced={false}
                    selected={!isAdvanced}
                >
                    {labels.item1}
                </ButtonSearch>
                <ButtonSearch
                    setIsAdvanced={setIsAdvanced}
                    isAdvanced={true}
                    selected={isAdvanced}
                >
                    {labels.item2}
                </ButtonSearch>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
};

interface ButtonSearchProps {
    children: React.ReactNode;
    setIsAdvanced: (value: boolean) => void;
    isAdvanced: boolean;
    selected: boolean;
}

const ButtonSearch = ({
    children,
    setIsAdvanced,
    isAdvanced,
    selected,
}: ButtonSearchProps) => {
    return (
        <Button
            onClick={() => setIsAdvanced(isAdvanced)}
            variant={selected ? "default" : "outline"}
            className={`w-full border-none rounded-none ${
                isAdvanced ? "rounded-tr-xl" : "rounded-tl-xl"
            } ${
                !selected
                    ? "bg-sig-gray2 text-primary-foreground hover:bg-sig-gray3"
                    : "bg-white text-foreground hover:bg-sig-white"
            }`}
        >
            {children}
        </Button>
    );
};

export default SearchContainer;
