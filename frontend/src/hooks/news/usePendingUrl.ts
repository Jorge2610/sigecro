import { PendingURL } from "@/components/noticias/penging-urls/colums";
import { useState } from "react";
import { deletePendingUrl } from "@/lib/api/pendingUrl";

const usePendingUrl = (data: PendingURL[]) => {
    const [tableData, setTableData] = useState(data);

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

    return { tableData, handleDelete };
};

export { usePendingUrl };
