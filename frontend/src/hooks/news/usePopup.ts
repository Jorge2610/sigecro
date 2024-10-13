import { useState } from "react";

const usePopup = (onSubmit: () => Promise<void>) => {
    const [open, setOpen] = useState(false);

    const submitData = async (): Promise<void> => {
        setOpen(false);
        await onSubmit();
    };

    const handleOpen = (state: boolean) => {
        setOpen((_) => state);
    };

    return { open, handleOpen, submitData };
};

export { usePopup };
