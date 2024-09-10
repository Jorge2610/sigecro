"use client";

import AutomaticRecord from "@/components/noticias/automatico/AutomaticRecord";
import AutomaticHelp from "@/components/noticias/automatico/AutomaticHelp";

const Asistido = () => {
    return (
        <div className="flex justify-center">
            <div className="flex flex-col gap-4 w-full max-w-[1024px]">
                <AutomaticHelp part={1}/>
                <AutomaticRecord />
            </div>
        </div>
    );
};

export default Asistido;
