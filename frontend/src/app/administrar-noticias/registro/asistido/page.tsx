"use client";

import AutomaticRecord from "@/components/noticias/automatico/AutomaticRecord";
import NewsHelper from "@/components/noticias/NewsHelper";

const helps = [
    "Selecciona una categoría e ingresa la URL desde la cual deseas extraer los datos.",
    'Haz clic en "Extraer". El sistema intentará extraer la información relevante automáticamente.',
];

const Asistido = () => {
    return (
        <div className="flex justify-center">
            <div className="flex flex-col gap-4 w-full max-w-[1024px]">
                <NewsHelper title="Registro asistido" helps={helps} />
                <AutomaticRecord />
            </div>
        </div>
    );
};

export default Asistido;
