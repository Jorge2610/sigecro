import Link from "next/link";
import { Button } from "./button";
import { H2 } from "./headings";

const PageNotFound = () => {
    return (
        <div className="h-[70dvh] flex flex-col gap-4 items-center justify-center">
            <p className="text-sig-blue text-[128px] font-bold">404!</p>
            <H2 className="font-montserrat text-5xl font-bold text-sig-blue">
                Página No Encontrada
            </H2>
            <p>
                Lo sentimos, la página que solicitó no pudo ser encontrada. Por
                favor, regrese a la página de inicio.
            </p>

            <Button asChild>
                <Link href="/">Página de Inicio</Link>
            </Button>
        </div>
    );
};

const ServerErrorPage = () => {
    return (
        <div className="h-[70dvh] flex flex-col gap-4 items-center justify-center">
            <p className="text-sig-blue text-[128px] font-bold">500!</p>
            <H2 className="font-montserrat text-5xl font-bold text-sig-blue">
                Error Interno del Servidor
            </H2>
            <p>
                Lo sentimos, ha ocurrido un error en el servidor. Por favor,
                regrese a la página de inicio.
            </p>
            <Button asChild>
                <Link href="/">Página de Inicio</Link>
            </Button>
        </div>
    );
};

export { PageNotFound, ServerErrorPage };
