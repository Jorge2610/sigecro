import React, { useState, KeyboardEvent, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Control, Controller, FieldValues } from "react-hook-form";

interface Props {
  control: any;
  name: string;
  label: string;
  tags: string[];
  setTags: (tags: string[]) => void;
}

const InputTagsForm = ({
  control,
  name,
  label,
  tags,
  setTags,
}: Props): JSX.Element => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = () => {
    if (inputValue.trim() !== "" && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tags]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col space-y-2">
          <label htmlFor={name} className="text-sm font-medium">
            {label}
          </label>
          <div className="flex flex-wrap items-center gap-2 p-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-sig-gray3 hover:bg-sig-text"
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
            <Input
              ref={inputRef}
              id={name}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                addTag();
                field.onBlur();
              }}
              placeholder={tags.length === 0 ? "Añadir tag..." : ""}
              className=""
            />
          </div>
        </div>
      )}
    />
  );
};

export default InputTagsForm;
