import { Button } from "@/components/ui/button";
import Link from "next/link";

const RolsPage = () => {
    return (
        <Button asChild title={"Ver permisos"}>
            <Link href={"/roles/permisos"}>Ver permisos</Link>
        </Button>
    );
};

export default RolsPage;
