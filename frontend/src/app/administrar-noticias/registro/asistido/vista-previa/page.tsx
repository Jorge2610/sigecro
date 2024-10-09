"use client";

import AutomaticPreview from "@/components/noticias/automatico/AutomaticPreview";
import NewsHelper from "@/components/noticias/NewsHelper";
import { useContext, useEffect } from "react";
import { AutomaticContext } from "@/store/AssitedRecordNewsProvider";
import { useRouter } from "next/navigation";

const helps = [
    "Revisa la información extraida.",
    "Completa los campos restantes.",
    'Haz clic en "Publicar" para finalizar.',
];

const VistaPrevia = () => {
    const { newsData } = useContext(AutomaticContext) || {};
    const router = useRouter();

    useEffect(() => {
        if (!newsData.title) {
            router.push("/administrar-noticias/registro/asistido");
        }
    }, [newsData, router]);

    return (
        <div>
            <NewsHelper title="Registro asistido" helps={helps} />
            {newsData.title ? (
                <AutomaticPreview newsData={newsData} />
            ) : (
                <div className="mt-4">
                    Vista previa no disponible. Redireccionando la página, por
                    favor, espere...
                </div>
            )}
        </div>
    );
};

export default VistaPrevia;
