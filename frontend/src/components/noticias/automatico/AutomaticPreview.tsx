import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { NewsData } from "./newsInterfaces";

export default function AutomaticPreview({ newsData }: { newsData: NewsData }) {
  return (
    <div className="flex flex-col gap-4">
      <a href={newsData.url} target="_blank" className="underline">
        {newsData.url}
      </a>
      <h2 className="text-3xl font-lora font-medium">{newsData.title}</h2>
      <div className="flex items-center">
        <span className="material-symbols-outlined text-sig-text mr-2">
          newspaper
        </span>
        {newsData.source}
        <span className="material-symbols-outlined text-sig-text ml-4 mr-2">
          calendar_clock
        </span>
        {format(newsData.dateTime, "dd-MM-yyyy HH:mm")}
      </div>
      <div>
        {newsData.content.map((paragraph, i) => {
          return (
            <p className="mb-4" key={i}>
              {paragraph}
            </p>
          );
        })}
      </div>
      <Separator className="mt-[-1rem]" />
      <Label htmlFor="newsCategory">Categoría</Label>
      <Select defaultValue="news">
        <SelectTrigger className="w-full" id="newsCategory">
          <SelectValue placeholder="Noticia" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="news">Noticia</SelectItem>
          <SelectItem value="others">Otros</SelectItem>
        </SelectContent>
      </Select>
      <div>Imagen:</div>
      <div className="flex justify-end gap-4">
        <Button variant={"outline"}>Cancelar</Button>
        <Button>Publicar</Button>
      </div>
    </div>
  );
}
