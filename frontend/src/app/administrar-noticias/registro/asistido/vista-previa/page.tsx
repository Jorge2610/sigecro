"use client";

import AutomaticPreview from "@/components/noticias/automatico/AutomaticPreview";
import NewsHelper from "@/components/noticias/NewsHelper";
import { useContext, useEffect } from "react";
import { AutomaticContext } from "@/components/noticias/automatico/AutomaticProvider";
import { useRouter } from "next/navigation";

const helps = [
    "Revisa la información extraida.",
    "Completa los campos restantes.",
    'Haz clic en "Publicar" para finalizar.',
];

const VistaPrevia = () => {
    const context = useContext(AutomaticContext);
    const newsData = context?.newsData;
    const router = useRouter();

    useEffect(() => {
        if (newsData === undefined) {
            router.push("/administrar-noticias/registro/asistido");
        }
    }, []);

    return (
        <div>
            <NewsHelper title="Registro asistido" helps={helps} />
            {newsData ? (
                <AutomaticPreview newsData={newsData} />
            ) : (
                "Vista previa no disponible, readirecionando pagina por favor espere..."
            )}
        </div>
    );
};

export default VistaPrevia;
