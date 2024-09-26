import { format } from "date-fns";

export type CardNewsProps = {
    title: string;
    source: string;
    date: Date;
    summary: string;
    tags?: string[];
};

const CardNews = ({ title, source, date, summary, tags }: CardNewsProps) => {
    return (
        <div  className="rounded border-2 border-slate-300 p-4 mb-4">
            <p className="text-2xl font-semibold">{title}</p>
            <div>
                <div className="flex flex-wrap gap-2 my-2">
                    <div className="flex space-x-2 mr-4">
                        <span className="material-symbols-outlined">
                            library_books
                        </span>
                        <p>{source}</p>
                    </div>
                    <div className="flex space-x-2">
                        <span className="material-symbols-outlined">
                            calendar_today
                        </span>
                        <p> {format(date, "dd-MM-yyyy HH:mm")}</p>
                    </div>
                </div>
                <div>
                    <p>{summary}</p>
                </div>
                <div className="flex flex-wrap mt-4">
                    {tags ? (
                        tags.map((tag, index) => (
                            <p
                                key={index}
                                className="mr-4 bg-sig-gray3 px-2 py-1 mt-2 rounded font-medium"
                            >
                                {tag}
                            </p>
                        ))
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardNews;
