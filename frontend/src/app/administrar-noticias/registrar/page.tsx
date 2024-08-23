"use client";

import RecordType from "@/components/noticias/automatico/RecordType";
import { Separator } from "@/components/ui/separator";
import AutomaticRecord from "@/components/noticias/automatico/AutomaticRecord";
import { useState, useEffect } from "react";
import NewsForm from "@/components/noticias/manual/NewsForm";
import { getAllCategories } from "@/components/noticias/manual/api";

export default function RegistrarNoticia() {
  const [recordType, setRecordType] = useState("automatic");
  const [preview, setPreview] = useState(false);
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    /**
     * Recupera todas las categorias desde la API y las actualiza en el estado del componente.
     *
     * @return {Promise<void>}
     */
    const getCategories = async (): Promise<void> => {
      const resp = await getAllCategories();
      if (resp) {
        setCategories(resp);
      }
    };
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
          <AutomaticRecord />
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
}
