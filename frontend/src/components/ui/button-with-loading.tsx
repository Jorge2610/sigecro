import { useState } from "react";
import { Button } from "./button";

type ButtonLoadigProps = {
    action: () => Promise<void>;
    title: string;
    loading: string;
};

const ButtonLoading = ({ action, title, loading }: ButtonLoadigProps) => {
    const [extracting, setExtracting] = useState(false);
    const handleAction = async () => {
        setExtracting(true);
        await action();
        setExtracting(false);
    };
    return (
        <Button type="button" disabled={extracting} onClick={handleAction}>
            {extracting ? (
                <>
                    <svg
                        className="material-symbols-outlined animate-spin h-5 w-5 text-white mr-2 "
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                        circle
                    </svg>
                    {loading}
                </>
            ) : (
                title
            )}
        </Button>
    );
};
export default ButtonLoading;
