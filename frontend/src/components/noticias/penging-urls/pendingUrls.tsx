"use client";

import { PendingURL } from "./colums";
import { useState } from "react";
import PendingUrlsDataTable from "./pendingUrlsDataTable";
import { deletePendingUrl } from "@/lib/api/pendingUrl";

type PendingUrlsProps = {
    data: PendingURL[];
};

const PendingUrls = ({ data }: PendingUrlsProps) => {
    const [tableData, setTableData] = useState(data);

    /**
     * Handles the deletion of selected rows by sending a DELETE request to the server
     * and updating the table data based on the server's response.
     *
     * @param {number[]} selectedRowIds - An array of IDs representing the selected rows to be deleted.
     * @returns {Promise<void>} Updates the table data if the deletion is successful.
     */
    const handleDelete = async (selectedRowIds: number[]): Promise<void> => {
        try {
            await deletePendingUrl({
                data: { ids: selectedRowIds },
            });
            const updatedData = tableData.filter(
                (row) => !selectedRowIds.includes(row.id)
            );
            setTableData(updatedData);
        } catch (error) {
            throw new Error("No se pudo eliminar las URLs");
        }
    };

    return <PendingUrlsDataTable data={tableData} onDelete={handleDelete} />;
};

export default PendingUrls;
