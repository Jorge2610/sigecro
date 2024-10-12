import { useCallback, useEffect, useRef, useState } from "react";

interface UseFileInputProps {
    nameImage?: string,
    updateImage: () => void
}

const useFileInput = ({ nameImage, updateImage }: UseFileInputProps)=> {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | undefined>(nameImage);

    useEffect(() => {
        setFileName(nameImage);
    }, [nameImage]);

    const handleFileChange = useCallback(
        (
            e: React.ChangeEvent<HTMLInputElement>,
            onChange: (value: File | undefined) => void
        ) => {
            const file = e.target.files?.[0];
            if (file) {
                setFileName(file.name);
                onChange(file);
            }
            updateImage();
        },
        [updateImage]
    );

    const handleButtonClick = () => inputFileRef.current?.click();

    const handleClearFile = (onChange: (value: undefined) => void) => {
        setFileName(undefined);
        onChange(undefined);
        if (inputFileRef.current) {
            inputFileRef.current.value = "";
        }
        updateImage?.();
    };

    return {
        inputFileRef,
        fileName,
        handleFileChange,
        handleButtonClick,
        handleClearFile,
    };
};

export { useFileInput };
