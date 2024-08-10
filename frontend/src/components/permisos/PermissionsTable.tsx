"use client";

import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PermissionsTable({
  permissions,
}: {
  permissions: any;
}) {
  const [permissionsState, setPermissionsState] = useState(permissions);

  const updatePermissionsState = (index: number) => {
    const updatedPermissions = JSON.parse(JSON.stringify(permissionsState));
    updatedPermissions[index - 1].expanded =
      !updatedPermissions[index - 1].expanded;
    setPermissionsState(updatedPermissions);
  };

  return (
    <TableBody>
      {permissionsState.map((permission: any) => {
        return (
          <TableRow
            className="flex flex-wrap items-center md:table-row h-[57px]"
            key={permission.id}
          >
            <TableCell className="w-[10%] md:w-[8%] xl:w-[4%] align-top">
              {permission.id}
            </TableCell>
            <TableCell className="w-[76%] md:w-[42%] xl:2-[26%] align-top">
              {permission.name}
            </TableCell>
            <TableCell className="w-[13%] md:hidden">
              <Button
                variant={"outline"}
                size={"icon"}
                onClick={(e) => updatePermissionsState(permission.id)}
                title="Mostrar descripción"
              >
                <span className="material-symbols-outlined text-sig-blue hover:cursor-pointer hover:text-sig-hblue">
                  {permission.expanded ? "arrow_drop_up" : "arrow_drop_down"}
                </span>
              </Button>
            </TableCell>
            <TableCell
              className={
                permission.expanded
                  ? "ps-[12%] w-[95%] pt-0 md:p-2"
                  : "hidden md:table-cell"
              }
            >
              {permission.description}
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
