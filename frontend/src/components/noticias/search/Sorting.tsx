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

const labelsSorting = {
    placeholder: "Ordenar por:",
    item0: { id: "0", Label: "Ordenar por:" },
    item1: { id: "1", Label: "Más recientes" },
    item2: { id: "2", Label: "Más antiguos" },
    item3: { id: "3", Label: "A-Z" },
    item4: { id: "4", Label: "Z-A" },
};

const labelAmount = {
    placeholder: "Cantidad:",
    item0: { id: "6", Label: "6" },
    item1: { id: "10", Label: "10" },
    item2: { id: "20", Label: "20" },
    item3: { id: "50", Label: "50" },
};

interface SortingProps {
    viewList: boolean;
    isFilters: boolean;
    setFilters: React.Dispatch<React.SetStateAction<boolean>>;
    onSortSubmit: (value: string) => void;
    onAmountSubmit: (value: string) => void;
    setViewList: (value: boolean) => void;
}
const Sorting = ({
    viewList,
    onSortSubmit,
    onAmountSubmit,
    isFilters,
    setFilters,
    setViewList,
}: SortingProps) => {
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
                        <Select
                            defaultValue={labelsSorting.item1.id}
                            onValueChange={onSortSubmit}
                        >
                            <SelectLabel className="text-nowrap text-xs">
                                {labelsSorting.placeholder}
                            </SelectLabel>
                            <SelectTrigger className="w-32">
                                <SelectValue
                                    placeholder={labelsSorting.item0.Label}
                                    className="min-w-32 truncate"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={labelsSorting.item1.id}>
                                    {labelsSorting.item1.Label}
                                </SelectItem>
                                <SelectItem value={labelsSorting.item2.id}>
                                    {labelsSorting.item2.Label}
                                </SelectItem>
                                <SelectItem value={labelsSorting.item3.id}>
                                    {labelsSorting.item3.Label}
                                </SelectItem>
                                <SelectItem value={labelsSorting.item4.id}>
                                    {labelsSorting.item4.Label}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-row items-center">
                        <Select
                            defaultValue={labelAmount.item1.id}
                            onValueChange={onAmountSubmit}
                        >
                            <SelectLabel className="text-nowrap text-xs">
                                {labelAmount.placeholder}
                            </SelectLabel>
                            <SelectTrigger className="w-20">
                                <SelectValue
                                    placeholder={labelAmount.item1.Label}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={labelAmount.item0.id}>
                                    {labelAmount.item0.Label}
                                </SelectItem>
                                <SelectItem value={labelAmount.item1.id}>
                                    {labelAmount.item1.Label}
                                </SelectItem>
                                <SelectItem value={labelAmount.item2.id}>
                                    {labelAmount.item2.Label}
                                </SelectItem>
                                <SelectItem value={labelAmount.item3.id}>
                                    {labelAmount.item3.Label}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </SelectGroup>
            </div>
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
        </div>
    );
};

export default Sorting;
