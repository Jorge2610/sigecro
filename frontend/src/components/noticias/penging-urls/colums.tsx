"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

interface PendingURL {
    id: number;
    user_name: string;
    url: string;
}

const columns: ColumnDef<PendingURL>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
    },
    {
        header: "#",
        cell: ({ row, table }) => {
            const rowIndex = row.index;
            const globalIndex = rowIndex + 1;
            return globalIndex;
        },
    },
    {
        accessorKey: "user_name",
        header: "Usuario",
    },
    {
        accessorKey: "url",
        header: "URL",
        cell: ({ row }) => {
            return (
                <div className="text-nowrap" title={row.getValue("url")}>
                    {row.getValue("url")}
                </div>
            );
        },
    },
];

export type { PendingURL };
export { columns };
