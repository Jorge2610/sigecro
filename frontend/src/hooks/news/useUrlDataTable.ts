import { PendingURL, columns } from "@/components/noticias/penging-urls/colums";
import { useState } from "react";
import {
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";
import { useHandleToast } from "../useHandleToast";

const SUCCES_MESSAGE = "El lote de URLs fue eliminado exitosamente.";
const ERROR_MESSAGE = "No se pudo eliminar el lote de URLs.";

const useUrlDataTable = (
    data: PendingURL[],
    onDelete: (selectedRowIds: number[]) => Promise<void>
) => {
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState<any>([]);
    const { showToast } = useHandleToast();

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

    const deleteURL = async (): Promise<void> => {
        const selectedRowIds = Object.keys(rowSelection).map((rowKey) => {
            return table.getRow(rowKey).original.id;
        });
        if (selectedRowIds.length > 0) {
            try {
                await onDelete(selectedRowIds);
                setRowSelection({});
                showToast("success", SUCCES_MESSAGE);
            } catch (error) {
                showToast("error", ERROR_MESSAGE);
            }
        }
    };

    return { table, rowSelection, deleteURL };
};

export { useUrlDataTable };
