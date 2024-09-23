import axios from "axios";
import { PendingURL } from "@/components/noticias/penging-urls/colums";
import PendingUrls from "@/components/noticias/penging-urls/pendingUrls";

const URLsPendientes = async () => {
    const pendingURLs: PendingURL[] = await axios
        .get(`${process.env.API_HOST}/news/scraping/batch`)
        .then((res) => {
            if (res.status === 200) {
                return res.data;
            }
        });
    return (
        <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-lora font-semibold">
                URLs pendientes
            </h1>
            <PendingUrls data={pendingURLs} />
        </div>
    );
};

export default URLsPendientes;
