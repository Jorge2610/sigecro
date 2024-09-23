"use client";

import { PendingURL, columns } from "./colums";
import {
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import DataTable from "../../ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

type DataTableProps = {
    data: PendingURL[];
    onDelete: (selectedRowIds: number[]) => Promise<void>;
};

const PendingUrlsDataTable = ({ data, onDelete }: DataTableProps) => {
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState<any>([]);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: "includesString",
        onGlobalFilterChange: setGlobalFilter,
        state: {
            rowSelection,
            globalFilter,
        },
    });

    /**
     * Prepares the selected row IDs for deletion by mapping the selected rows
     * to their respective IDs and triggering the deletion process.
     * Clears the row selection after initiating the deletion.
     *
     * @returns {Promise<void>} Triggers the deletion of the selected rows and resets the row selection.
     */
    const deleteURL = async (): Promise<void> => {
        const selectedRowIds = Object.keys(rowSelection).map((rowKey) => {
            return table.getRow(rowKey).original.id;
        });
        if (selectedRowIds.length > 0) {
            await onDelete(selectedRowIds);
            setRowSelection({});
        }
    };

    return (
        <div className="space-y-4">
            <Input
                placeholder="Buscar usuario..."
                onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            />
            <DataTable table={table} columns={columns} />
            <div className="flex flex-wrap justify-end items-center gap-4">
                <div className="text-sm w-full sm:w-[58%] md:w-none md:grow">
                    * El tiempo estimado de procesamiento es de:{" "}
                    {data.length * 5} min.
                </div>
                <Button variant="outline" asChild>
                    <Link href="/administrar-noticias/registro">Atrás</Link>
                </Button>
                <Button variant="destructive" onClick={deleteURL}>
                    Eliminar URL
                    {Object.keys(rowSelection).length > 1 ? "s" : ""}
                </Button>
            </div>
        </div>
    );
};

export default PendingUrlsDataTable;
