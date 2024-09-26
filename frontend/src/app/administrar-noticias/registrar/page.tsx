"use client";

import RecordType from "@/components/noticias/automatico/RecordType";
import { Separator } from "@/components/ui/separator";
import AutomaticRecord from "@/components/noticias/automatico/AutomaticRecord";
import { useState, useEffect } from "react";

import axios from "axios";

const RegistrarNoticia = () => {
    const [recordType, setRecordType] = useState("automatic");
    const [preview, setPreview] = useState(false);
    const [categories, setCategories] = useState<any>([]);

    useEffect(() => {
        
        getCategories();
    }, []);

    return (
        <div className="flex justify-center">
            <div className="flex flex-col gap-4 w-full max-w-[1024px]">
                <h2 className="w-full font-lora text-sig-blue font-medium">
                    {preview ? "Vista previa" : " Formulario"}
                </h2>
                {!preview && (
                    <>
                        <h1 className="w-full text-3xl md:text-4xl font-lora font-semibold">
                            Registrar noticia
                        </h1>
                        <RecordType
                            placeholder={recordType}
                            setRecordType={setRecordType}
                        />
                        <Separator />
                    </>
                )}
                {recordType === "automatic" ? (
                    <AutomaticRecord categories={categories} />
                ) : (
                    <NewsForm
                        preview={preview}
                        setPreview={setPreview}
                        setRecordType={setRecordType}
                        categories={categories}
                    />
                )}
            </div>
        </div>
    );
};

export default RegistrarNoticia;
