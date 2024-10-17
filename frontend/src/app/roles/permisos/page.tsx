import {
    Table,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import PermissionsTable from "@/components/permissions/PermissionsTable";
import axios from "axios";

const Permisos = async () => {
    try {
        const res = await axios.get(`${process.env.API_HOST}/permissions`);
        return (
            <div className="border rounded-md bg-white">
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
            </div>
        );
    } catch (error: any) {
        return <div>No se pudo obtener la información.</div>;
    }
};

export default Permisos;
