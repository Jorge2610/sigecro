"use client";

import AssistedRecord from "@/components/noticias/assisted/AssistedRecord";
import NewsHelper from "@/components/noticias/NewsHelper";
import { Head } from "@/components/ui/headings";

const helps = [
    "Selecciona una categoría e ingresa la URL desde la cual deseas extraer los datos.",
    'Haz clic en "Extraer". El sistema intentará extraer la información relevante automáticamente.',
];

const AssistedPage = () => {
    return (
        <div className="flex justify-center">
            <div className="flex flex-col gap-4 w-full max-w-[1024px]">
                <Head>Formulario</Head>
                <NewsHelper title="Registro asistido" helps={helps} />
                <AssistedRecord />
            </div>
        </div>
    );
};

export default AssistedPage;
