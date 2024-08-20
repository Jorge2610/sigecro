"use client";

import RecordType from "@/components/noticias/automatico/RecordType";
import { Separator } from "@/components/ui/separator";
import AutomaticRecord from "@/components/noticias/automatico/AutomaticRecord";
import { useState } from "react";
import InputFile from "@/components/noticias/manual/NewsForm";

export default function RegistrarNoticia() {
  const [recordType, setRecordType] = useState("automatic");

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 w-full max-w-[1024px]">
        <h2 className="w-full font-lora text-sig-blue font-medium">
          Formulario
        </h2>
        <h1 className="w-full text-3xl md:text-4xl font-lora font-semibold">
          Registrar noticia
        </h1>
        <RecordType setRecordType={setRecordType} />
        <Separator />
        {recordType === "automatic" ? <AutomaticRecord /> : <InputFile />}
      </div>
    </div>
  );
}
