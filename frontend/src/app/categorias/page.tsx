import Link from "next/link";
import { Button } from "@/components/ui/button";

const Categoria = async () => {
  return (
    <>
      <h1 className="pb-4">Categoria</h1>
      <Link href="categorias/crear-categoria" className="p-1">
        <Button>Registrar categoria</Button>
      </Link>
    </>
  );
};

export default Categoria;
