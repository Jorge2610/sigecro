import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PermissionsTable from "@/components/permisos/PermissionsTable";
import axios from "axios";

const API = process.env.API_HOST;

export default async function Permisos() {
  const permissions = await axios.get(`${API}/permissions`).then((response) => {
    return response.data;
  });

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
      <PermissionsTable permissions={permissions}></PermissionsTable>
    </Table>
  );
}