import React, { useState, KeyboardEvent, useRef } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { capitalizeWords } from "@/lib/stringsUtil";

interface Props {
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    setDuplicatedTags: React.Dispatch<React.SetStateAction<boolean>>;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const InputTags = ({
    tags,
    setTags,
    inputProps,
    setDuplicatedTags,
}: Props): JSX.Element => {
    const [inputValue, setInputValue] = useState("");
    const [isInputFocused, setIsInputFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    /**
     * Agrega una etiqueta al array de etiquetas. is la etiqueta no existe.
     *
     * @return {void}
     */
    const addTag = (): void => {
        let trimmedValue = inputValue.trim();
        trimmedValue = capitalizeWords(trimmedValue);
        if (trimmedValue && !tags.includes(trimmedValue)) {
            setDuplicatedTags(false);

            setTags([...tags, trimmedValue]);
            setInputValue("");
        } else {
            trimmedValue != "" && setDuplicatedTags(true);
        }
    };

    /**
     * Remueve una etiqueta del array de etiquetas.
     *
     * @param {string} tagToRemove -  la etiqueta a ser removida.
     * @return {void}
     */
    const removeTag = (tagToRemove: string): void => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    /**
     *
     * Maneja eventos de pulsación de teclas para el campo de entrada.
     *
     * @param {KeyboardEvent<HTMLInputElement>} e - La entrada de teclado.
     * @return {void}
     */
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
            e.preventDefault();
            addTag();
            tags.length == 4 && setIsInputFocused(false);
        } else if (
            e.key === "Backspace" &&
            inputValue === "" &&
            tags.length > 0
        ) {
            removeTag(tags[tags.length - 1]);
        }
    };

    /**
     * Maneja los evenots de clic sobre el campo de entrada.
     *
     * @return {void}
     */
    const handleClick = () => {
        if (tags.length < 5) {
            setIsInputFocused(true);
            inputRef.current?.focus();
        }
    };

    /**
     * Genera un conjunto de etiquetas mediante la IA
     *
     * @return {void}
     */
    const generateIA = () => {
        setTags([]);
        const getTagsIA = [
            "Tecnología",
            "Cultura",
            "Deportes",
            "Economía",
            "Salud",
        ];
        setTags(getTagsIA);
    };

    return (
        <>
            <div
                className={`flex flex-wrap w-full bg-white gap-2 p-2 rounded-md border border-slate-200 ${
                    isInputFocused && "border-1 border-slate-950 "
                }`}
                onClick={handleClick}
            >
                {tags.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-sig-gray2 hover:bg-sig-gray2 h-7"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-xs hover:text-red-500"
                        >
                            <X size={14} />
                        </button>
                    </Badge>
                ))}

                {tags.length < 5 && (
                    <input
                        {...inputProps}
                        maxLength={20}
                        ref={inputRef}
                        onBlur={(e) => {
                            setIsInputFocused(false);
                            setInputValue(e.target.value);
                            addTag();
                        }}
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setDuplicatedTags(false);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            tags.length === 0 ? "Escriba una etiqueta..." : ""
                        }
                        className="px-3 py-1 text-sm w-100  transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300  "
                    />
                )}
            </div>
        </>
    );
};

export default InputTags;
