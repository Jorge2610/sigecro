import { H1, H3, H4 } from "./headings";
import { format } from "date-fns";
import Image from "next/image";
import { NewsViewType } from "@/types/newsType";
import { Badge } from "@/components/ui/badge";

interface NewsViewProps {
    newsData: NewsViewType;
}

const NewsView = ({ newsData }: NewsViewProps) => {
    return (
        <div className="space-y-4">
            {newsData.category_name && <H3 className="text-sig-blue">{newsData.category_name}</H3>}
            <H1>{newsData.title}</H1>
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">link</span>
                {newsData.url && (
                    <a
                        href={newsData.url}
                        target="_blank"
                        className="underline"
                    >
                        {newsData.url}
                    </a>
                )}
            </div>
            <div className="flex items-center flex-wrap gap-4 md:gap-8">
                <div className="flex items-center">
                    <b>Fuente original:</b>&nbsp;{newsData.source}
                </div>
                <div className="flex items-center">
                    <b>Fecha:</b>&nbsp;
                    {format(newsData.date, "dd-MM-yyyy HH:mm")}
                </div>
            </div>
            {newsData.summary && <Summary text={newsData.summary as string} />}
            {newsData.image_url && (
                <div className="w-full h-[300px]">
                    <Image
                        src={newsData.image_url}
                        width={300}
                        height={300}
                        className="h-[300px] w-auto m-auto p-4"
                        alt="image"
                    />
                </div>
            )}
            <div>
                {newsData.content.map((paragraph: any, i: any) => {
                    return (
                        <p className="mb-4" key={i}>
                            {paragraph}
                        </p>
                    );
                })}
            </div>
            {newsData.tags && <Tags tags={newsData.tags} />}
        </div>
    );
};

const Summary = ({ text }: { text: string }) => {
    return (
        <div className="w-full p-4 bg-sig-gray2 rounded-xl">
            <H4>Resumen</H4>
            <p className="text-sm font-regular">{text}</p>
        </div>
    );
};

const Tags = ({ tags }: { tags: string[] }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {tags?.map((tag) => (
                <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-sig-gray2 h-7 hover:bg-sig-gray2"
                >
                    {tag}
                </Badge>
            ))}
        </div>
    );
};

export default NewsView;
