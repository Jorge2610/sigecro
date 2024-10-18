import { Button } from "@/components/ui/button";
import Link from "next/link";

const ManageNewsPage = () => {
    return (
        <Button asChild title={"Registrar noticia"}>
            <Link href={"/administrar-noticias/registro"}>
                Registrar noticia
            </Link>
        </Button>
    );
};

export default ManageNewsPage;
