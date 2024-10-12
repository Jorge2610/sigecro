import { H1 } from "./headings";
import { format } from "date-fns";
import Image from "next/image";

interface NewsViewProps {
    title: string;
    url?: string;
    source: string;
    dateTime: Date;
    imageUrl?: string;
    content: string[];
}

const NewsView = ({ ...props }: NewsViewProps) => {
    const { title, url, source, dateTime, imageUrl, content } = props;
    return (
        <>
            <H1>{title}</H1>
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">link</span>
                {url && (
                    <a href={url} target="_blank" className="underline">
                        {url}
                    </a>
                )}
            </div>
            <div className="flex items-center flex-wrap gap-4 md:gap-8">
                <div className="flex items-center">
                    <span className="material-symbols-outlined text-sig-text mr-2">
                        newspaper
                    </span>
                    {source}
                </div>
                <div className="flex items-center">
                    <span className="material-symbols-outlined text-sig-text mr-2">
                        calendar_clock
                    </span>
                    {format(dateTime, "dd-MM-yyyy HH:mm")}
                </div>
            </div>
            {imageUrl && (
                <div className="w-full h-[300px]">
                    <Image
                        src={imageUrl}
                        width={300}
                        height={300}
                        className="h-[300px] w-auto m-auto p-4"
                        alt="image"
                    />
                </div>
            )}
            <div>
                {content.map((paragraph: any, i: any) => {
                    return (
                        <p className="mb-4" key={i}>
                            {paragraph}
                        </p>
                    );
                })}
            </div>
        </>
    );
};

export default NewsView;
