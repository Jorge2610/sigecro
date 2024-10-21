type Operator = "" | "NOT";

interface FilterCondition {
    [field: string]: {
        value: string;
        operator: Operator;
    };
}

interface AdvancedFilter {
    conditions: FilterCondition;
    logic: string;
}

interface AdvancedSearchProps {
    filters: AdvancedFilter[];
    onSearch: (filters: AdvancedFilter[]) => void;
}

export type {FilterCondition,AdvancedFilter,AdvancedSearchProps}