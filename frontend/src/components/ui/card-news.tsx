import { format } from "date-fns";
import { News } from "../noticias/newsInterfaces";

import { Badge } from "@/components/ui/badge";

type CardNewsProps = {
    data: News;
};
const CardNews = ({ data }: CardNewsProps) => {
    console.log(data);
    return (
        <div className="rounded border-2 border-slate-300 p-4 mb-4">
            <p className="text-2xl font-semibold">{data.title}</p>
            <div>
                <div className="flex flex-wrap gap-2 my-2">
                    <div className="flex space-x-2 mr-4">
                        <span className="material-symbols-outlined">
                            library_books
                        </span>
                        <p>{data.source}</p>
                    </div>
                    <div className="flex space-x-2">
                        <span className="material-symbols-outlined">
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
