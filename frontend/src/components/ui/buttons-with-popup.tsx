import { Button } from "./button";
import { Popup, PopupState } from "./popup";

interface ButtonsPopupsProps {
    open: boolean;
    handleSubmit: () => Promise<void>;
    setOpen: (state: boolean) => void;
    secondaryHref: string;
    popupsMessages: Messages;
}

type Messages = {
    primaryTitle: string;
    primaryDescription: string;
    secondaryTitle: string;
    secondaryDescription: string;
};

const ButtonsWithPopup = ({ ...props }: ButtonsPopupsProps) => {
    const { open, handleSubmit, setOpen, secondaryHref, popupsMessages } =
        props;
    return (
        <div className="flex justify-end gap-4">
            <Popup
                title={popupsMessages.secondaryTitle}
                description={popupsMessages.secondaryDescription}
                href={secondaryHref}
            >
                <Button variant="outline">Cancelar</Button>
            </Popup>
            <Button type="submit">Publicar</Button>
            <PopupState
                title={popupsMessages.primaryTitle}
                description={popupsMessages.primaryDescription}
                openState={open}
                onClose={() => {
                    setOpen(false);
                }}
                onConfirm={handleSubmit}
            />
        </div>
    );
};

export default ButtonsWithPopup;
