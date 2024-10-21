import Link from "next/link";
import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/headings";

const CategoryPage = async () => {
    return (
        <div className="space-y-4">
            <H1>Categoría</H1>
            <Button asChild>
                <Link href="categorias/crear-categoria">
                    Registrar categoría
                </Link>
            </Button>
        </div>
    );
};

export default CategoryPage;
