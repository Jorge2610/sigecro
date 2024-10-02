import React, { useState } from "react";

import { Button } from "@/components/ui/button";

type SearchingProps = {
    setIsAdvanced: React.Dispatch<React.SetStateAction<boolean>>;
    isAdvanced: boolean;
    children?: React.ReactNode;
};
const Searcing = ({ children, setIsAdvanced, isAdvanced }: SearchingProps) => {
    return (
        <div className="w-full bg-white rounded-xl p-0 m-0">
            <div className="flex justify-center flex-nowrap">
                <Button
                    onClick={() => setIsAdvanced(false)}
                    variant={isAdvanced ? "outline" : "default"}
                    className={`w-full border-none rounded-none rounded-tl-xl ${
                        isAdvanced ? "bg-sig-gray2 hover:bg-sig-gray3" : "bg-white hover:bg-white text-sig-text"
                    }`}
                >
                    Busqueda
                </Button>
                <Button
                    onClick={() => setIsAdvanced(true)}
                    variant={isAdvanced ? "default" : "outline"}
                    className={`w-full border-none rounded-none rounded-tr-xl ${
                        !isAdvanced ? "bg-sig-gray2 hover:bg-sig-gray3" : "bg-white hover:bg-white text-sig-text"
                    }`}
                >
                    Busqueda Avanzada
                </Button>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
};

export default Searcing;
