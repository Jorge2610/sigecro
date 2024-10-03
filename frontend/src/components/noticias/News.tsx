import { Data} from "./manual/formSchema";
import { format } from "date-fns";
import Image from "next/image";
import { splitIntoParagraphs } from "@/lib/stringsUtil";
import { Badge } from "@/components/ui/badge";


interface NewsProps {
        data?: {title:string,
                category_name:string,
                content:string,
                source: string,
                date:Date,
                tags:[],
                url:string
        };
        imageURL: string | null; 
}

const News = ({data,imageURL}:NewsProps)=>{                    
    const parapraphs = splitIntoParagraphs(data?.content ?? "");
    return (
        <div className="flex flex-col gap-4 bg-white p-6 border border-slate-300 rounded">
            <h3>{data?.category_name}</h3>
            <h2 className="text-3xl font-lora font-medium">{data?.title}</h2>
            <div className="flex items-center">
                <span className="material-symbols-outlined text-sig-text mr-2">
                    newspaper
                </span>
                {data?.source}
                <span className="material-symbols-outlined text-sig-text ml-20 mr-2">
                    calendar_clock
                </span>
                {data?.date && format(data.date, "dd-MM-yyyy HH:mm")}
            </div>
            {imageURL && (
                <div className="w-full h-[300px]">
                    <Image
                        src={imageURL}
                        width={300}
                        height={200}
                        className="h-[300px] w-auto m-auto p-4"
                        alt="image"
                    />
                </div>
            )}
            <div>
                {parapraphs.map((paragraph, i) => {
                    return (
                        <p className="mb-4" key={i}>
                            {paragraph}
                        </p>
                    );
                })}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
                {data?.tags?.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-sig-gray2 h-7 hover:bg-sig-gray2"
                    >
                        {tag}
                    </Badge>
                ))}
            </div>
            {data?.url && (
                <div className="flex flex-row gap-4 align-middle">
                    <span className="material-symbols-outlined">link</span>
                    <a
                        href={data?.url}
                        target="_blank"
                        className="underline flex align-middle"
                    >
                        {data?.url}
                    </a>
                </div>
            )}

        </div>
    );

}
export {News};