"use client";

import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const AutomaticHelp = ({ part }: { part: number }) => {
    const [visible, setVisible] = useState(false);

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-lora font-semibold">
                    Registro asistido
                </h1>
                <Button
                    variant={"ghost"}
                    onClick={() => setVisible(!visible)}
                    title="Ayuda"
                    className="px-2"
                >
                    <span className="material-symbols-outlined text-sig-white">
                        help
                    </span>
                </Button>
            </div>
            {visible && (
                <div>
                    <ol className="mb-4">
                        <li>
                            1.{" "}
                            {part === 1
                                ? "Selecciona una categoría e ingresa la URL desde la cual deseas extraer los datos."
                                : "Revisa la información extraida."}
                        </li>
                        <li>
                            2.{" "}
                            {part === 1
                                ? 'Haz clic en "Extraer". El sistema intentará extraer la información relevante automáticamente.'
                                : "Completa los campos restantes."}
                        </li>
                        {part !== 1 && (
                            <li>3. Haz clic en "Publicar" para finalizar.</li>
                        )}
                    </ol>
                </div>
            )}
            <Separator className="mb-4" />
        </div>
    );
};

export default AutomaticHelp;
