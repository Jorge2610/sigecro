import { format } from "date-fns";
import { News } from "../noticias/newsInterfaces";

import { Badge } from "@/components/ui/badge";
import { formantNewsTitle} from "@/lib/stringsUtil";

type CardNewsProps = {
    data: News;
};

const CardNews = ({ data }: CardNewsProps) => {
    
    const urlNews = `/noticias/${formantNewsTitle(data.title)}_${data.id}`;
    return (
        <div className="rounded-[16px] border border-slate-200 p-6 mb-4 h-full bg-white shadow-lg">
            <a href={urlNews}>
                <p className="text-2xl font-semibold">{data.title}</p>
            </a>
            <div>
                <div className="flex flex-wrap gap-2 my-2">
                    <div className="flex space-x-2 mr-4">
                        <span className="material-symbols-outlined select-none">
                            library_books
                        </span>
                        {
                        data.url === "" ? (
                            <p>{data.source}</p>
                        ) : (
                            <a href={data.url} className="underline underline-offset-1">
                            {data.source}
                            </a>
                        )
                        }
                        
                    </div>
                    <div className="flex space-x-2">
                        <span className="material-symbols-outlined select-none">
                            calendar_today
                        </span>
                        <p> {format(data.date, "dd-MM-yyyy HH:mm")}</p>
                    </div>
                </div>
                <div>
                    <p>{data.summary}</p>
                </div>
                {data.tags[0] && (
                    <div className="flex flex-wrap mt-4 gap-4">
                        {data?.tags.map((tag, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="bg-sig-gray2 hover:bg-sig-gray2 h-7"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardNews;
