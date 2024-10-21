"use client";

import { PendingURL, columns } from "./colums";
import { useState } from "react";
import DataTable from "../../ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PopupState } from "../../ui/popup";
import { useUrlDataTable } from "@/hooks/news/useUrlDataTable";
import { usePopup } from "@/hooks/news/usePopup";

type DataTableProps = {
    data: PendingURL[];
    onDelete: (selectedRowIds: number[]) => Promise<void>;
};

const PendingUrlsDataTable = ({ data, onDelete }: DataTableProps) => {
    const { table, rowSelection, deleteURL } = useUrlDataTable(data, onDelete);
    const { onSubmit, handleOpen, open } = usePopup(deleteURL);

    return (
        <div className="space-y-4">
            <Input
                placeholder="Buscar usuario..."
                onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            />
            <DataTable table={table} columns={columns} />
            <div className="flex flex-wrap justify-end items-center gap-4">
                {data.length > 0 && (
                    <div className="text-sm w-full sm:w-[58%] md:w-none md:grow">
                        * El tiempo estimado de procesamiento es de:{" "}
                        {data.length * 5} min.
                    </div>
                )}
                <ActionButtons
                    deleteUrl={onSubmit}
                    handleOpen={handleOpen}
                    state={open}
                    rowSelection={rowSelection}
                />
            </div>
        </div>
    );
};

interface ActionButtonsProps {
    handleOpen: (state: boolean) => void;
    rowSelection: {};
    deleteUrl: () => Promise<void>;
    state: boolean;
}

const ActionButtons = ({ ...props }: ActionButtonsProps) => {
    const { handleOpen, rowSelection, deleteUrl, state } = props;
    return (
        <>
            <Button variant="outline" asChild>
                <Link href="/administrar-noticias/registro">Atrás</Link>
            </Button>
            <Button
                variant="destructive"
                onClick={() => handleOpen(true)}
                disabled={!(Object.keys(rowSelection).length > 0)}
            >
                Eliminar Url
            </Button>
            <PopupState
                title="Registrar lote"
                description="¿Deseas enviar este lote de URLs para su extracción?"
                openState={state}
                onClose={() => {
                    handleOpen(false);
                }}
                onConfirm={deleteUrl}
            />
        </>
    );
};

export default PendingUrlsDataTable;
