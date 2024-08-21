/* eslint-disable react/display-name */
import { es } from "date-fns/locale";
import React from "react";

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

type Props = {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  max?: number;
  array?: { id: string; name: string }[];
  rows?: number;
  tags?: string[];
  setTags?: React.Dispatch<React.SetStateAction<string[]>>;
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
            <Input maxLength={max} placeholder={placeholder} {...field} />
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
              const selectedItem = array?.find((item) => item.id === id);
              field.onChange(selectedItem);
            }}
            defaultValue={array && array?.length > 0 ? array[0].id : undefined}
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

const InputFileForm = ({ control, name, label }: Props) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange, ...fieldProps } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...fieldProps}
              type="file"
              accept="image/jpg,image/jpeg,image/png,image/webp"
              onChange={(e) => {
                onChange(e.target.files ? e.target.files[0] : undefined);
              }}
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
};
