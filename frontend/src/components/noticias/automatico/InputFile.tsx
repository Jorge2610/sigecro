import { Input } from "@/components/ui/input";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

type Props = {
    control: any;
    name: string;
    label: string;
    updateImage: () => void;
};

const InputFileForm = ({ control, name, label, updateImage }: Props) => {
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
                                onChange(
                                    e.target.files
                                        ? e.target.files[0]
                                        : undefined
                                );
                                updateImage();
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export { InputFileForm };
