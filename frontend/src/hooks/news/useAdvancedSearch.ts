import { AdvancedFilter } from "@/types/advancedSearchType";
import { useState } from "react";

const fieldToEnglish = {
    "Todos los campos": "all_fields",
    Título: "title",
    Contenido: "content",
    Etiquetas: "tags",
};
const useAdvancedSearch = (
    filters: AdvancedFilter[],
    setSearch: (filters: AdvancedFilter[]) => void
) => {
    const [fieldsArray, setFieldsArray] = useState<string[]>([]);
    const [selecKey, setSelecKey] = useState(0);
    const [showHelp, setShowHelp] = useState<boolean>(false);
    const [inputValues, setInputValues] = useState<{ [key: number]: string }>(
        Object.fromEntries(
            filters.map((f, i) => [i, Object.values(f.conditions)[0].value])
        )
    );
    const [operatorValues, setOperatorValues] = useState<{
        [key: number]: string;
    }>({});
    const [errors, setErrors] = useState<{ [key: number]: string }>({});

    const maxFields = 3;

    const handleChange = (e: string) => {
        if (fieldsArray.length < maxFields) {
            setFieldsArray([...fieldsArray, e]);
            setSelecKey((prev) => prev + 1);
        }
    };

    const handleInputChange = (index: number, value: string) => {
        setInputValues((prev) => ({ ...prev, [index]: value }));
        if (errors[index]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[index];
                return newErrors;
            });
        }
    };

    const handleOperatorChange = (index: number, value: string) => {
        setOperatorValues((prev) => ({ ...prev, [index]: value }));
    };

    const handleClear = () => {
        setFieldsArray([]);
        setInputValues({});
        setOperatorValues({});
        setErrors({});
        setSelecKey((prev) => prev + 1);
        setSearch([]);
    };

    const validateInputs = () => {
        const newErrors: { [key: number]: string } = {};
        let isValid = true;
        if (!inputValues[0] || inputValues[0].trim() === "") {
            newErrors[0] = "Este campo es requerido";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleSearch = (): void => {
        if (!validateInputs()) {
            return;
        }

        const newFilters: AdvancedFilter[] = fieldsArray
            .map((field, index) => {
                if (!inputValues[index] || inputValues[index].trim() === "") {
                    return null;
                }
                const englishField =
                    fieldToEnglish[field as keyof typeof fieldToEnglish];
                return {
                    conditions: {
                        [englishField]: {
                            value: inputValues[index],
                            operator:
                                operatorValues[index] === "NOT" ? "NOT" : "",
                        },
                    },
                    logic:
                        operatorValues[index] === "NOT"
                            ? "AND"
                            : operatorValues[index],
                };
            })
            .filter((filter): filter is AdvancedFilter => filter !== null);
        setSearch(newFilters);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleCloseField = (index: number): void => {
        setFieldsArray(fieldsArray.filter((_, i) => i !== index));
        const newInputValues = { ...inputValues };
        delete newInputValues[index];
        setInputValues(newInputValues);
        const newOperatorValues = {
            ...operatorValues,
        };
        delete newOperatorValues[index];
        setOperatorValues(newOperatorValues);
        const newErrors = { ...errors };
        delete newErrors[index];
        setErrors(newErrors);
    };

    return {
        fieldsArray,
        selecKey,
        showHelp,
        inputValues,
        operatorValues,
        errors,
        maxFields,
        setShowHelp,
        handleChange,
        handleInputChange,
        handleOperatorChange,
        handleClear,
        handleSearch,
        handleKeyDown,
        handleCloseField,
    };
};

export { useAdvancedSearch };
