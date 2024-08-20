import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function () {
  return (
    <Button asChild title={"Ver permisos"}>
      <Link href={"/roles/permisos"}>Ver permisos</Link>
    </Button>
  );
}
