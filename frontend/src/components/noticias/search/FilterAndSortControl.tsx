import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const LABELS_SORTING = {
    placeholder: "Ordenar por:",
    items: [
        { id: "0", label: "Por relevancia" },
        { id: "1", label: "Más recientes" },
        { id: "2", label: "Más antiguos" },
        { id: "3", label: "A-Z" },
        { id: "4", label: "Z-A" },
    ],
};

const LABELS_AMOUNT = {
    placeholder: "Cantidad:",
    items: [
        { id: "6", label: "6" },
        { id: "10", label: "10" },
        { id: "20", label: "20" },
        { id: "50", label: "50" },
    ],
};

interface FilterAndSortControlProps {
    viewList: boolean;
    isFilters: boolean;
    setFilters: (value: boolean) => void;
    onSortSubmit: (value: string) => void;
    onAmountSubmit: (value: string) => void;
    setViewList: (value: boolean) => void;
}
const FilterAndSortControl = ({
    viewList,
    onSortSubmit,
    onAmountSubmit,
    isFilters,
    setFilters,
    setViewList,
}: FilterAndSortControlProps) => {
    return (
        <div className="flex  md:flex-row lg:justify-between flex-wrap w-full gap-4">
            <div className="flex md:flex-row gap-2 flex-col-reverse w-full lg:w-auto">
                <Button
                    className="flex gap-2"
                    onClick={() => setFilters(!isFilters)}
                >
                    <span className="material-symbols-outlined">
                        filter_list
                    </span>
                    Filtros
                </Button>
                <SelectGroup className="flex flex-row flex-wrap justify-between md:justify-start items-center gap-4">
                    <div className="flex flex-row items-center">
                        <SelectOption
                            action={onSortSubmit}
                            labels={LABELS_SORTING}
                        />
                    </div>
                    <div className="flex flex-row items-center">
                        <SelectOption
                            action={onAmountSubmit}
                            labels={LABELS_AMOUNT}
                        />
                    </div>
                </SelectGroup>
            </div>
            <ButtonsChangeView viewList={viewList} setViewList={setViewList} />
        </div>
    );
};

interface SelectOptionProps {
    action: (value: string) => void;
    labels: Labels;
}

type Labels = {
    placeholder: string;
    items: { id: string; label: string }[];
};

const SelectOption = ({ action, labels }: SelectOptionProps) => {
    return (
        <Select defaultValue={labels.items[1].id} onValueChange={action}>
            <SelectLabel className="text-nowrap text-xs">
                {labels.placeholder}
            </SelectLabel>
            <SelectTrigger className="w-36">
                <SelectValue
                    placeholder={labels.items[0].label}
                    className="min-w-36 truncate"
                />
            </SelectTrigger>
            <SelectContent>
                {labels.items.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                        {item.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

interface ButtonChangeViewProps {
    viewList: boolean;
    setViewList: (value: boolean) => void;
}
const ButtonsChangeView = ({
    viewList,
    setViewList,
}: ButtonChangeViewProps) => {
    return (
        <div className="hidden lg:block">
            <Button
                variant={"ghost"}
                disabled={viewList}
                className="disabled:text-sig-gray3"
                onClick={() => setViewList(true)}
            >
                <span className="material-symbols-outlined">view_list</span>
            </Button>
            <Button
                variant={"ghost"}
                disabled={!viewList}
                className="disabled:text-sig-gray3"
                onClick={() => setViewList(false)}
            >
                <span className="material-symbols-outlined">grid_view</span>
            </Button>
        </div>
    );
};

export default FilterAndSortControl;
