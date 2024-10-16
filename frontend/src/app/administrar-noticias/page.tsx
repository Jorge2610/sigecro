import { Button } from "@/components/ui/button";

const AdministrarNoticias = () => {
    return (
        <Button asChild title={"Registrar noticia"}>
            <a href={"/administrar-noticias/registro"}>Registrar noticia</a>
        </Button>
    );
};

export default AdministrarNoticias;
