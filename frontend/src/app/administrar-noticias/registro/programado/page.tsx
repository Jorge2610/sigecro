import NewsHelper from "@/components/noticias/NewsHelper";
import ProgramedCard from "@/components/noticias/programmed/ProgramedCard";
import { getSources } from "@/lib/api/sources";

const helps: Array<string> = [
    "Haz clic en la fuente que deseas configurar para ver los tópicos disponibles.",
    "Selecciona los tópicos que serán extraídos, el proceso debe estar detenido.",
    'Haz clic en "Programar". El sistema programará las extracciones diarias con los tópicos seleccionados.',
    'Si deseas detener las extracciones programadas, haz clic en el botón "Detener".',
];

interface Source {
    id: number;
    name: string;
    active: boolean;
    last_date: Date;
    topics: Array<{ id: number; name: string; active: boolean }>;
}

const ProgrammedPage = async () => {
    const sources: Array<Source> = await getSources();
    return (
        <div className="flex justify-center">
            <div className="flex flex-col gap-4 w-full max-w-[1024px]">
                <NewsHelper title="Registro programado" helps={helps} />
                {sources.map((source) => {
                    return (
                        <ProgramedCard
                            key={source.id}
                            id={source.id}
                            title={source.name}
                            topics={source.topics}
                            last_record={new Date(source.last_date)}
                            active={source.active}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ProgrammedPage;
