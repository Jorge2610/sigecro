import {
    Table,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import PermissionsTable from "@/components/permissions/PermissionsTable";
import { getPermissions } from "@/lib/api/permissions";

const PermissionsPage = async () => {
    const permissions = await getPermissions();
    return (
        <div className="border rounded-md bg-white p-1">
            <Table>
                <TableHeader>
                    <TableRow className="hidden md:table-row">
                        <TableHead className="">#</TableHead>
                        <TableHead>Permiso</TableHead>
                        <TableHead>Descripción</TableHead>
                    </TableRow>
                </TableHeader>
                <PermissionsTable permissions={permissions}></PermissionsTable>
            </Table>
        </div>
    );
};

export default PermissionsPage;
