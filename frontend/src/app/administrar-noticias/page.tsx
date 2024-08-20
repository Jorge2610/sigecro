import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function () {
  return (
    <Button asChild title={"Registrar noticia"}>
      <Link href={"/administrar-noticias/registrar"}>Registrar noticia</Link>
    </Button>
  );
}
