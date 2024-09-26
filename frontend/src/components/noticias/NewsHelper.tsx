"use client";

import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type NewsHelperProps = {
    title: string;
    helps: Array<string>;
};

const NewsHelper = ({ title, helps }: NewsHelperProps) => {
    const [visible, setVisible] = useState(false);
    const helpsHeight: string = helps.length * 24 + 33 + "px";

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-lora font-semibold">
                    {title}
                </h1>
                <Button
                    variant={"ghost"}
                    onClick={() => setVisible(!visible)}
                    title="Ayuda"
                    className="px-2"
                >
                    <span className="material-symbols-outlined text-sig-white">
                        help
                    </span>
                </Button>
            </div>
            <Separator />
            <div
                className="overflow-hidden ease-in-out duration-300"
                style={{ maxHeight: visible ? "40dvh" : "0px" }}
            >
                <ol className="my-4 ml-8" style={{ listStyleType: "decimal" }}>
                    {helps.map((help, i) => {
                        return <li key={i}>{help}</li>;
                    })}
                </ol>
                <Separator />
            </div>
        </div>
    );
};

export default NewsHelper;
