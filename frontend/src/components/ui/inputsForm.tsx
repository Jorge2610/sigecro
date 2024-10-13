"use client";

import { es } from "date-fns/locale";
import { Control, FieldPath, FieldValues } from "react-hook-form";
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
import InputTags from "../noticias/manual/tags";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CategoryType } from "@/types/categoryType";
import { useFileInput } from "@/hooks/useFileInput";

interface InputProps<T extends FieldValues> {
    control: Control<T>;
    name: FieldPath<T>;
    label?: string;
    className?: string;
    placeholder?: string;
    max?: number;
    rows?: number;
    type?: "text" | "number" | "email" | "password" | "url";
}

interface InpuntSelectFormProps<T extends FieldValues> extends InputProps<T> {
    array?: CategoryType[];
}

interface InputFileFormProps<T extends FieldValues> extends InputProps<T> {
    nameImage?: string;
    updateImage: () => void;
}

interface InputTagsFormProps<T extends FieldValues> extends InputProps<T> {
    tags: string[];
    setTags: (value: string[]) => void;
    setDuplicatedTags: (value: boolean) => void;
}

const InputForm = <T extends FieldValues>({
    control,
    name,
    label,
    className,
    placeholder,
    max,
    type,
}: InputProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full">
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <Input
                            className={className}
                            maxLength={max}
                            placeholder={placeholder}
                            type={type}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

const InputDateForm = <T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
}: InputProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    {label && <FormLabel htmlFor="datetime">{label}</FormLabel>}
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

const InputTextAreaForm = <T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    rows = 3,
    max,
}: InputProps<T>) => {
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

const InputSelectForm = <T extends FieldValues>({
    control,
    name,
    label,
    array,
}: InpuntSelectFormProps<T>) => {
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

const InputFileForm = <T extends FieldValues>({
    control,
    name,
    label,
    nameImage,
    updateImage,
}: InputFileFormProps<T>) => {
    const {
        handleFileChange,
        fileName,
        inputFileRef,
        handleButtonClick,
        handleClearFile,
    } = useFileInput({ nameImage, updateImage });
    return (
        <FormField
            control={control}
            name={name}
            render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}
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

const InputTagsForm = <T extends FieldValues>({
    control,
    name,
    label,
    tags,
    setTags,
    setDuplicatedTags,
}: InputTagsFormProps<T>) => {
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
