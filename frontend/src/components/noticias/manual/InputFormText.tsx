import { es } from "date-fns/locale";
import React, { useRef, useState } from "react";

import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import InputTags from "./tags";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Props = {
    control: any;
    name: string;
    label: string;
    placeholder?: string;
    max?: number;
    array?: { id: string; name: string }[];
    rows?: number;
    nameImage?: string | null;
    updateImage?: () => void;
};
const InputForm = ({ control, name, label, placeholder, max }: Props) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            maxLength={max}
                            placeholder={placeholder}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

const InputDateForm = ({ control, name, label, placeholder }: Props) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel htmlFor="datetime">{label}</FormLabel>
                    <FormControl>
                        <DateTimePicker
                            displayFormat={{ hour24: "dd-MM-yyyy HH:mm" }}
                            date={field.value}
                            locale={es}
                            placeholder={placeholder}
                            granularity="minute"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

const InputTextAreaForm = ({
    control,
    name,
    label,
    placeholder,
    rows = 3,
    max,
}: Props) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder={placeholder}
                            className="resize-none"
                            rows={rows}
                            {...field}
                            maxLength={max}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

const InputSelectForm = ({ control, name, label, array }: Props) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Select
                        onValueChange={(id) => {
                            const selectedItem = array?.find(
                                (item) => item.id === id
                            );
                            field.onChange(selectedItem);
                        }}
                        defaultValue={
                            array && array?.length > 0 ? array[0].id : undefined
                        }
                        value={field.value?.id}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {array?.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                    {item.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

const InputFileForm = ({
    control,
    name,
    label,
    nameImage,
    updateImage,
}: Props) => {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(nameImage ?? null);

    /**
     * Maneja los cambios del archivo seleccionado.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - El evento disparado por el cambio de archivo.
     * @param {(value: File | undefined) => void} onChange - Un callback que se llama cuando se cambia el archivo.
     * @return {void}
     */
    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        onChange: (value: File | undefined) => void
    ): void => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            onChange(file);
        }
        updateImage !== undefined ? updateImage() : "";
    };

    /**
     * Simula el clic en el boton de seleccionar archivo.
     *
     * @return {void}
     */
    const handleButtonClick = (): void => {
        inputFileRef.current?.click();
    };

    /**
     * Limpia el archivo seleccionado reseteando el nombre de archivo y llamando el callback de onChange.
     *
     * @param {(value: undefined) => void} onChange - Una funcion callback que se llama cuando se limpia el archivo.
     * @return {void}
     */
    const handleClearFile = (onChange: (value: undefined) => void): void => {
        setFileName(null);
        onChange(undefined);
        if (inputFileRef.current) {
            inputFileRef.current.value = "";
        }
        updateImage !== undefined ? updateImage() : "";
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="flex flex-nowrap w-full gap-4 justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleButtonClick}
                                className="flex flex-auto align-middle gap-2 w-[85%]"
                            >
                                <span className="material-symbols-outlined text-sig-gray3 font-thin">
                                    image
                                </span>
                                <span className="truncate w-full text-start align-middle ">
                                    {fileName || "Seleccionar imagen"}
                                </span>
                                <input
                                    {...fieldProps}
                                    ref={inputFileRef}
                                    type="file"
                                    accept="image/jpg,image/jpeg,image/png,image/webp"
                                    onChange={(e) =>
                                        handleFileChange(e, onChange)
                                    }
                                    className="hidden"
                                />
                            </Button>
                            {fileName && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleClearFile(onChange)}
                                    className="hover:bg-sig-red hover:text-sig-gray1 h-auto p-2"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
interface Tags {
    control: any;
    name: string;
    label: string;
    tags: string[];
    setDuplicatedTags: React.Dispatch<React.SetStateAction<boolean>>;
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
}
const InputTagsForm = ({
    control,
    name,
    label,
    tags,
    setTags,
    setDuplicatedTags,
}: Tags) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <InputTags
                            setTags={setTags}
                            tags={tags}
                            inputProps={field}
                            setDuplicatedTags={setDuplicatedTags}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export {
    InputForm,
    InputDateForm,
    InputTextAreaForm,
    InputSelectForm,
    InputFileForm,
    InputTagsForm,
};
