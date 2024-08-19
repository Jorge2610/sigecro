import Link from "next/link";
import { Button } from "@/components/ui/button";

const Noticias = async () => {
  return (
    <>
      <h1>Noticias</h1>
      <Link href="/noticias/registro-noticias">
        <Button>Registrar Noticias</Button>
      </Link>
    </>
  );
};

export default Noticias;
