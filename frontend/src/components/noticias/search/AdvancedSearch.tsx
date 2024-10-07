import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useState, KeyboardEvent } from "react";

const labels = {
    placeholder: "Seleccione el criterio de búsqueda",
    item1: "Todos los campos",
    item2: "Título",
    item3: "Contenido",
    item4: "Etiquetas",
};

const fieldToEnglish = {
    "Todos los campos": "all_fields",
    Título: "title",
    Contenido: "content",
    Etiquetas: "tags",
};

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

const helpText = {
    title: "Ayuda de Búsqueda Avanzada",
    content: [
        "Esta herramienta te permite realizar búsquedas complejas usando múltiples criterios:",
        "1. Selecciona un campo de búsqueda del menú desplegable",
        "2. Ingresa el valor que deseas buscar en el campo de texto",
        "3. Para búsquedas con múltiples criterios, puedes elegir operadores lógicos:",
        "   - AND: Encuentra resultados que cumplan ambos criterios",
        "   - OR: Encuentra resultados que cumplan al menos uno de los criterios",
        "   - NOT: Excluye resultados que cumplan el criterio",
        "4. Puedes añadir hasta 3 criterios de búsqueda",
        "5. Usa 'Limpiar' para reiniciar la búsqueda",
        "6. Presiona 'Buscar' o la tecla Enter para ejecutar la búsqueda",
    ],
};

const AdvancedSearch = ({ filters, onSearch }: AdvancedSearchProps) => {
    const [fieldsArray, setFieldsArray] = useState<string[]>(
        filters.map((f) => {
            const field = Object.keys(f.conditions)[0];
            return (
                Object.entries(fieldToEnglish).find(
                    ([_, v]) => v === field
                )?.[0] || ""
            );
        })
    );
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
        onSearch([]);
    };

    const validateInputs = () => {
        const newErrors: { [key: number]: string } = {};
        let isValid = true;

        // Solo validamos el primer campo
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
                // Solo incluimos en el filtro si hay un valor
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

        onSearch(newFilters);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="space-y-4">
            <div className={"flex justify-between items-center"}>
                <p className="font-semibold text-sig-blue">Búsqueda Avanzada</p>
                <Button
                    variant="ghost"
                    className="w-10"
                    onClick={() => setShowHelp(!showHelp)}
                >
                    <span className="material-symbols-outlined">help</span>
                </Button>
            </div>
            {showHelp && (
                <Alert>
                    <AlertTitle>{helpText.title}</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc pl-4 space-y-1">
                            {helpText.content.map((text, index) => (
                                <li key={index}>{text}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}
            <Select
                key={selecKey}
                onValueChange={handleChange}
                disabled={fieldsArray.length >= maxFields}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={labels.placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={labels.item1}>{labels.item1}</SelectItem>
                    <SelectItem value={labels.item2}>{labels.item2}</SelectItem>
                    <SelectItem value={labels.item3}>{labels.item3}</SelectItem>
                    <SelectItem value={labels.item4}>{labels.item4}</SelectItem>
                </SelectContent>
            </Select>

            <div className="flex flex-col gap-4 mt-4">
                {fieldsArray?.map((field, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                            <span
                                className={`text-sm ${
                                    errors[index] ? "text-sig-red" : ""
                                }`}
                            >
                                {field} {index === 0 ? "*" : ""}
                            </span>
                            <Button
                                variant="ghost"
                                className="h-6 w-6 hover:bg-sig-red hover:text-white"
                                onClick={() => {
                                    setFieldsArray(
                                        fieldsArray.filter(
                                            (_, i) => i !== index
                                        )
                                    );
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
                                }}
                            >
                                X
                            </Button>
                        </div>
                        <div className="flex flex-nowrap flex-row w-full gap-4">
                            {index > 0 && (
                                <Select
                                    defaultValue="AND"
                                    onValueChange={(value) =>
                                        handleOperatorChange(index, value)
                                    }
                                >
                                    <SelectTrigger className="w-20">
                                        <SelectValue placeholder="Operador" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AND">AND</SelectItem>
                                        <SelectItem value="OR">OR</SelectItem>
                                        <SelectItem value="NOT">NOT</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                            <Input
                                placeholder="Ingresa el valor"
                                className={`${index < 0 && "w-full"}`}
                                value={inputValues[index] || ""}
                                onChange={(e) =>
                                    handleInputChange(index, e.target.value)
                                }
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        {errors[index] && (
                            <span className="text-red-500 text-sm">
                                {errors[index]}
                            </span>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-end mt-4">
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        className="hover:bg-sig-red hover:text-white"
                        onClick={handleClear}
                    >
                        Limpiar
                    </Button>
                    <Button variant="default" onClick={handleSearch}>
                        Buscar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdvancedSearch;
