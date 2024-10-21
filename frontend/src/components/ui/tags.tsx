import React, { useState, KeyboardEvent, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { capitalizeWords } from "@/lib/stringsUtil";

interface InputTagsProps {
    tags: string[];
    setTags: (tags: string[]) => void;
    setDuplicatedTags: (tags: boolean) => void;
    inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 20;

const InputTags = ({
    tags,
    setTags,
    inputProps,
    setDuplicatedTags,
}: InputTagsProps) => {
    const [inputValue, setInputValue] = useState<string>("");
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const addTag = useCallback(() => {
        const trimmedValue = capitalizeWords(inputValue.trim());
        if (trimmedValue && !tags.includes(trimmedValue)) {
            setDuplicatedTags(false);
            setTags([...tags, trimmedValue]);
            setInputValue("");
        } else if (trimmedValue) {
            setDuplicatedTags(true);
        }
    }, [inputValue, tags, setTags, setDuplicatedTags]);

    const removeTag = useCallback((tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    }, [tags, setTags]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (["Enter", ",", "Tab"].includes(e.key)) {
            e.preventDefault();
            addTag();
            if (tags.length === MAX_TAGS - 1) setIsInputFocused(false);
        } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    }, [addTag, inputValue, removeTag, tags]);

    const handleClick = useCallback(() => {
        if (tags.length < MAX_TAGS) {
            setIsInputFocused(true);
            inputRef.current?.focus();
        }
    }, [tags]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setDuplicatedTags(false);
    }, [setDuplicatedTags]);

    const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        setIsInputFocused(false);
        setInputValue(e.target.value);
        addTag();
    }, [addTag]);

    return (
        <div
            className={`flex flex-wrap w-full bg-white gap-2 p-2 rounded-md border ${
                isInputFocused ? "border-slate-950" : "border-slate-200"
            }`}
            onClick={handleClick}
        >
            {tags.map((tag) => (
                <TagBadge key={tag} tag={tag} onRemove={removeTag} />
            ))}

            {tags.length < MAX_TAGS && (
                <input
                    {...inputProps}
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleInputBlur}
                    maxLength={MAX_TAG_LENGTH}
                    placeholder={tags.length === 0 ? "Escriba una etiqueta..." : ""}
                    className="px-3 py-1 text-sm w-100 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                />
            )}
        </div>
    );
};

interface TagBadgeProps {
    tag: string;
    onRemove: (tag: string) => void;
}

const TagBadge = ({ tag, onRemove } : TagBadgeProps) => (
    <Badge variant="secondary" className="bg-sig-gray2 hover:bg-sig-gray2 h-7">
        {tag}
        <button
            type="button"
            onClick={() => onRemove(tag)}
            className="ml-1 text-xs hover:text-red-500"
        >
            <X size={14} />
        </button>
    </Badge>
);

TagBadge.displayName = "TagBadge";

export default InputTags;