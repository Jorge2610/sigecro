"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface LabeledCheckboxProps {
    id: string;
    labelText: string;
    active: boolean;
    onCheck: () => void;
    disabled: boolean;
}

const LabeledCheckbox = (props: LabeledCheckboxProps) => {
    return (
        <div className="flex items-center">
            <Checkbox
                id={props.id}
                onCheckedChange={props.onCheck}
                checked={props.active}
                disabled={props.disabled}
            />
            <Label htmlFor={props.id} className="pl-2">
                {props.labelText}
            </Label>
        </div>
    );
};

export default LabeledCheckbox;
