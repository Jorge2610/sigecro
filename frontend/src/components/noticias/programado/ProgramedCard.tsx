"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import LabeledCheckbox from "@/components/ui/labeled-checkbox";
import { Button } from "@/components/ui/button";
import { PopupState } from "@/components/ui/popup";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

interface ProgramedCardProps {
    id: number;
    title: string;
    topics: Array<{ id: number; name: string; active: boolean }>;
    active: boolean;
}

const ProgramedCard = (props: ProgramedCardProps) => {
    const { title, topics, active, id } = props;
    const [topicsState, setTopicsState] = useState(topics);
    const [activeSource, setActiveSource] = useState(active);
    const [expanded, setExpanded] = useState(false);
    const [programPopup, setProgramPopup] = useState(false);
    const [stopPopup, setStopPopup] = useState(false);
    const { toast } = useToast();

    /**
     * Toggles the active state of a specific topic in the topicsState array.
     *
     * @param {number} i - The index of the topic to toggle.
     * @returns {void}
     */
    const handleCheck = (i: number): void => {
        const newTopicsState = [...topicsState];
        newTopicsState[i].active = !newTopicsState[i].active;
        setTopicsState(newTopicsState);
    };

    /**
     * Checks if at least one topic in the topicsState array is active.
     *
     * @returns {boolean} Returns true if at least one topic is active, otherwise false.
     */
    const topicChecked = (): boolean => {
        let checked = topicsState.find((topic) => topic.active);
        return checked !== undefined ? true : false;
    };

    /**
     * Sends a request to start the scheduled scraping for the selected source and topics.
     * Displays a toast notification indicating the success or failure of the operation.
     *
     * @returns {Promise<void>} Returns a promise that resolves when the scraping program starts.
     * @throws Will display a toast notification if an error occurs while starting the scraping program.
     */
    const handleStart = async (): Promise<void> => {
        try {
            await axios.post("/api/news/scraping/programed", {
                source: { id: id, active: true },
                topics: topicsState,
            });
            setActiveSource(true);
            toast({
                title: "Registro programado iniciado",
                description: `El registro programado de ${title} fue iniciado.`,
                variant: "default",
            });
        } catch (error) {
            toast({
                title: "Registro programado detenido",
                description: `El registro programado de ${title} no pudo ser iniciado.`,
                variant: "destructive",
            });
        }
        setProgramPopup(false);
    };

    /**
     * Sends a request to stop the scheduled scraping for the selected source.
     * Displays a toast notification indicating the success or failure of the operation.
     *
     * @returns {Promise<void>} Returns a promise that resolves when the scraping program stops.
     * @throws Will display a toast notification if an error occurs while stopping the scraping program.
     */
    const handleStop = async (): Promise<void> => {
        try {
            await axios.post("/api/news/scraping/programed", {
                source: { id: id, active: false },
                topics: [],
            });
            setActiveSource(false);
            toast({
                title: "Registro programado detenido",
                description: `El registro programado de ${title} se detuvo.`,
                variant: "default",
            });
        } catch (error) {
            toast({
                title: "Registro programado activo",
                description: `El registro programado de ${title} no pudo ser detenido.`,
                variant: "destructive",
            });
        }
        setStopPopup(false);
    };

    return (
        <div
            className={`bg-white rounded px-4 border ${
                activeSource ? "border-sig-green" : "border-slate-200"
            } ease-in-out duration-300 overflow-hidden ${
                expanded ? "h-[304px]" : "h-[64px]"
            }`}
        >
            <div
                className="flex items-center gap-4 py-4 select-none hover:cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <span
                    className="material-symbols-outlined text-sig-blue"
                    style={{ fontSize: "32px" }}
                >
                    newspaper
                </span>
                <h2 className="text-2xl font-lora w-full">{title}</h2>
                <span
                    className="material-symbols-outlined text-sig-gray3"
                    style={{ fontSize: "32px" }}
                >
                    {expanded ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                </span>
            </div>
            <Separator />
            <div className="py-4 space-y-2">
                {topicsState.map((topic, i) => {
                    return (
                        <LabeledCheckbox
                            key={topic.id}
                            id={topic.id + ""}
                            labelText={topic.name}
                            active={topic.active}
                            onCheck={() => handleCheck(i)}
                            disabled={activeSource}
                        />
                    );
                })}
            </div>
            <Separator />
            <div className="flex justify-end gap-4 my-4">
                <Button
                    variant="destructive"
                    disabled={!activeSource}
                    onClick={() => setStopPopup(true)}
                >
                    Detener
                </Button>
                <PopupState
                    title="Detener registro programado"
                    description="¿Deseas detener el registro programado?"
                    openState={stopPopup}
                    onClose={() => {
                        setStopPopup(false);
                    }}
                    onConfirm={() => handleStop()}
                />
                <Button
                    disabled={!(topicChecked() && !activeSource)}
                    onClick={() => setProgramPopup(true)}
                >
                    Iniciar
                </Button>
                <PopupState
                    title="Iniciar registro programado"
                    description="¿Deseas iniciar el registro programado con los tópicos seleccionados?"
                    openState={programPopup}
                    onClose={() => {
                        setProgramPopup(false);
                    }}
                    onConfirm={() => handleStart()}
                />
            </div>
        </div>
    );
};

export default ProgramedCard;
