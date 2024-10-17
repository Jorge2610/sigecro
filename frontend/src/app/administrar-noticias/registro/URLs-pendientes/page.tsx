import { PendingURL } from "@/components/noticias/penging-urls/colums";
import PendingUrls from "@/components/noticias/penging-urls/pendingUrls";
import { H1 } from "@/components/ui/headings";
import { getPendignUrl } from "@/lib/api/pendingUrl";

const URLsPendientes = async () => {
    const pendingURLs: PendingURL[] = await getPendignUrl();
    return (
        <div className="space-y-4">
            <H1>URLs pendientes</H1>
            <PendingUrls data={pendingURLs} />
        </div>
    );
};

export default URLsPendientes;
