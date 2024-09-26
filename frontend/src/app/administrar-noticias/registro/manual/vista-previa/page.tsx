/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useContext, useEffect } from "react";
import { NewsManualContext } from "@/components/noticias/manual/ManualNewsProvider";
import { useRouter } from "next/navigation";
import Preview from "@/components/noticias/manual/NewsPreview";

const VistaPrevia = () => {
    const context = useContext(NewsManualContext);
    const newsData = context?.newsData;
    const imageURL = context?.imageURL;

    const router = useRouter();

    useEffect(() => {
        if (newsData === null) {
            router.push("/administrar-noticias/registro/manual");
        }
    }, [newsData]);

    return (
        <div>
            {newsData ? (
                <Preview
                    data={newsData}
                    imageURL={imageURL ?? null}
                />
            ) : (
                "Vista previa no disponible, readirecionando pagina por favor espere..."
            )}
        </div>
    );
};

export default VistaPrevia;
