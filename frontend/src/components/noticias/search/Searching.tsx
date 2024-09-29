import { useState } from "react";

import { Button } from "@/components/ui/button";

type SearchingProps = {
    children?: React.ReactNode;
    setSearch: React.Dispatch<React.SetStateAction<string> | any>;
    initialValue?: string;
};
const Searcing = ({ setSearch, initialValue }: SearchingProps) => {
    const [isActive, setIsActive] = useState<boolean>(false);
    return (
        <div className="w-full p-4 bg-sig-gray2 rounded-xl">
            <div className="flex justify-center">
                <Button
                    onClick={() => setIsActive(!isActive)}
                    className={`${isActive ? "bg-sig-blue" : ""}`}
                >
                    Busqueda
                </Button>
                <Button>Busqueda Avanzada</Button>
            </div>
            {children}
        </div>
    );
};
