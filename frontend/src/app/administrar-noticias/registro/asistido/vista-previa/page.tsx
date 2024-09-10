"use client";

import AutomaticPreview from "@/components/noticias/automatico/AutomaticPreview";
import AutomaticHelp from "@/components/noticias/automatico/AutomaticHelp";
import { useContext, useEffect } from "react";
import { AutomaticContext } from "@/components/noticias/automatico/AutomaticProvider";
import { useRouter } from "next/navigation";

const VistaPrevia = () => {
    const context = useContext(AutomaticContext);
    const newsData = context?.newsData;
    const router = useRouter();
    const setNewsData = context?.setNewsData;

    useEffect(() => {
        if (newsData === undefined) {
            router.push("/administrar-noticias/registro/asistido");
        }
    }, []);

    return (
        <div>
            <AutomaticHelp part={2} />
            {newsData ? (
                <AutomaticPreview
                    newsData={newsData}
                    setNewsData={setNewsData}
                />
            ) : (
                "Vista previa no disponible, readirecionando pagina por favor espere..."
            )}
        </div>
    );
};

export default VistaPrevia;
