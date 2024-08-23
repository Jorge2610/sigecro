import {
    Table,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import PermissionsTable from "@/components/permisos/PermissionsTable";
import axios from "axios";

export default async function Permisos() {
    try {
        const res = await axios.get(`${process.env.API_HOST}/permissions`);
        return (
            <Table>
                <TableCaption>Lista de permisos SIGECRO</TableCaption>
                <TableHeader>
                    <TableRow className="hidden md:table-row">
                        <TableHead className="">#</TableHead>
                        <TableHead>Permiso</TableHead>
                        <TableHead>Descripción</TableHead>
                    </TableRow>
                </TableHeader>
                <PermissionsTable permissions={res.data}></PermissionsTable>
            </Table>
        );
    } catch (error: any) {
        return <div>No se pudo obtener la información.</div>;
    }
}
