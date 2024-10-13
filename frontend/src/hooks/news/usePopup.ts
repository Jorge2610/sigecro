import { useState } from "react";

const usePopup = (submitData: () => Promise<void>) => {
    const [open, setOpen] = useState(false);

    const onSubmit = async (): Promise<void> => {
        setOpen(false);
        await submitData();
    };

    const handleOpen = (state: boolean) => {
        setOpen((_) => state);
    };

    return { open, handleOpen, onSubmit };
};

export { usePopup };
