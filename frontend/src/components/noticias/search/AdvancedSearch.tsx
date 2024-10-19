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
import { AdvancedSearchProps } from "@/types/advancedSearchType";
import { useAdvancedSearch } from "@/hooks/news/useAdvancedSearch";
import { Head } from "@/components/ui/headings";

const labels = {
    placeholder: "Seleccione el criterio de búsqueda",
    item1: "Todos los campos",
    item2: "Título",
    item3: "Contenido",
    item4: "Etiquetas",
};

const HELP_TEXT = {
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

const MAX_FIELDS = 3;
const AdvancedSearch = ({ filters, onSearch }: AdvancedSearchProps) => {
    const {
        fieldsArray,
        selecKey,
        showHelp,
        inputValues,
        setShowHelp,
        errors,
        handleChange,
        handleCloseField,
        handleClear,
        handleSearch,
        handleOperatorChange,
        handleInputChange,
        handleKeyDown,
    } = useAdvancedSearch(filters, onSearch);

    return (
        <div className="space-y-4">
            <div className={"flex justify-between items-center"}>
                <Head>Búsqueda avanzada</Head>
                <Button
                    variant="ghost"
                    className="w-10"
                    onClick={() => setShowHelp(!showHelp)}
                >
                    <span className="material-symbols-outlined">help</span>
                </Button>
            </div>
            <AdvancedHelper showHelp={showHelp} />
            <Select
                key={selecKey}
                onValueChange={handleChange}
                disabled={fieldsArray.length >= MAX_FIELDS}
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
            <FieldsArray
                fieldsArray={fieldsArray}
                errors={errors}
                inputValues={inputValues}
                setOperatorValues={handleOperatorChange}
                setInputValues={handleInputChange}
                closeField={handleCloseField}
                handleKeyDown={handleKeyDown}
            />
            <div className="flex justify-end">
                <div className="space-x-4">
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

interface FieldsArrayProps {
    fieldsArray: string[];
    errors: { [key: number]: string };
    inputValues: { [key: number]: string };
    setOperatorValues: (index: number, value: string) => void;
    setInputValues: (index: number, value: string) => void;
    handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    closeField: (index: number) => void;
}
const FieldsArray = ({
    fieldsArray,
    errors,
    inputValues,
    setOperatorValues,
    setInputValues,
    handleKeyDown,
    closeField,
}: FieldsArrayProps) => {
    return (
        <div className="flex flex-col gap-4">
            {fieldsArray?.map((field, index) => (
                <div key={index} className="">
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
                            onClick={() => closeField(index)}
                        >
                            X
                        </Button>
                    </div>
                    <div className="flex flex-nowrap flex-row w-full">
                        {index > 0 && (
                            <Select
                                defaultValue="AND"
                                onValueChange={(value) =>
                                    setOperatorValues(index, value)
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
                                setInputValues(index, e.target.value)
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
    );
};

const AdvancedHelper = ({ showHelp }: { showHelp: boolean }) => {
    return (
        showHelp && (
            <Alert>
                <AlertTitle>{HELP_TEXT.title}</AlertTitle>
                <AlertDescription>
                    <ul className="list-disc pl-4">
                        {HELP_TEXT.content.map((text, index) => (
                            <li key={index}>{text}</li>
                        ))}
                    </ul>
                </AlertDescription>
            </Alert>
        )
    );
};

export default AdvancedSearch;
