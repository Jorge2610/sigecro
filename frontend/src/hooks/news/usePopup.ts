import { useState } from "react";

const usePopup = (submitData: () => Promise<void>) => {
    const [open, setOpen] = useState(false);

    const onSubmit = async (): Promise<void> => {
        await submitData();
        setOpen(false);
    };

    const handleOpen = (state: boolean) => {
        setOpen((_) => state);
    };

    return { open, handleOpen, onSubmit };
};

export { usePopup };
