"use client";

import RecordType from "@/components/registrar_noticia/RecordType";
import { Separator } from "@/components/ui/separator";
import AutomaticRecord from "@/components/registrar_noticia/AutomaticRecord";
import { useState } from "react";

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
        {recordType === "automatic" ? <AutomaticRecord /> : <></>}
      </div>
    </div>
  );
}
