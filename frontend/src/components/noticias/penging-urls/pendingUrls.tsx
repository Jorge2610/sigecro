"use client";

import { PendingURL } from "./colums";
import PendingUrlsDataTable from "./pendingUrlsDataTable";
import { usePendingUrl } from "@/hooks/news/usePendingUrl";

type PendingUrlsProps = {
    data: PendingURL[];
};

const PendingUrls = ({ data }: PendingUrlsProps) => {
    const { tableData, handleDelete } = usePendingUrl(data);

    return <PendingUrlsDataTable data={tableData} onDelete={handleDelete} />;
};

export default PendingUrls;
