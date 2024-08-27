import { Button } from "@/components/ui/button";
import Link from "next/link";

const AdministrarNoticias = () => {
    return (
        <Button asChild title={"Registrar noticia"}>
            <Link href={"/administrar-noticias/registrar"}>
                Registrar noticia
            </Link>
        </Button>
    );
};

export default AdministrarNoticias;
