import { useState } from "react";
import { Button } from "./button";
import { Loading } from "./resources/svgs";

interface ButtonLoadigProps {
    action: () => Promise<void>;
    title: string;
    titleOnLoading: string;
}

const ButtonLoading = ({
    action,
    title,
    titleOnLoading,
}: ButtonLoadigProps) => {
    const [extracting, setExtracting] = useState(false);
    const handleAction = async () => {
        setExtracting(true);
        await action();
        setExtracting(false);
    };
    return (
        <Button type="button" disabled={extracting} onClick={handleAction}>
            {extracting && <Loading />}
            {extracting ? titleOnLoading : title}
        </Button>
    );
};

interface ButtonSubmitLoadingProps {
    children: React.ReactNode;
    state: boolean;
}

const ButtonSubmitLoading = ({ children, state }: ButtonSubmitLoadingProps) => {
    return (
        <Button type="submit" disabled={state}>
            {state && <Loading />}
            {children}
        </Button>
    );
};

export { ButtonLoading, ButtonSubmitLoading };
