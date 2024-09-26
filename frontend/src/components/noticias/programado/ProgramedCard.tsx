"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import LabeledCheckbox from "@/components/ui/labeled-checkbox";
import { Button } from "@/components/ui/button";
import { PopupState } from "@/components/ui/popup";

interface ProgramedCardProps {
    title: string;
    topics: Array<{ id: number; name: string; active: boolean }>;
    active: boolean;
}

const ProgramedCard = (props: ProgramedCardProps) => {
    const { title, topics, active } = props;
    const [topicsState, setTopicsState] = useState(topics);
    const [activeSource, setActiveSource] = useState(active);
    const [expanded, setExpanded] = useState(false);
    const [programPopup, setProgramPopup] = useState(false);
    const [stopPopup, setStopPopup] = useState(false);

    const handleCheck = (i: number): void => {
        const newTopicsState = [...topicsState];
        newTopicsState[i].active = !newTopicsState[i].active;
        setTopicsState(newTopicsState);
    };

    const topicChecked = (): boolean => {
        let checked = topicsState.find((topic) => topic.active);
        return checked !== undefined ? true : false;
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
                    onConfirm={() => {
                        setActiveSource(false);
                        setStopPopup(false);
                    }}
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
                    onConfirm={() => {
                        setActiveSource(true);
                        setProgramPopup(false);
                    }}
                />
            </div>
        </div>
    );
};

export default ProgramedCard;
