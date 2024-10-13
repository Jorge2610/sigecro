import { Button } from "../ui/button";
import { Popup, PopupState } from "../ui/popup";
import { popupCancel, popupPublic } from "@/data/newsMessages";

interface NewsPopupsProps {
    open: boolean;
    handleSubmit: () => Promise<void>;
    setOpen: (state: boolean) => void;
    secondaryHref: string;
}

const NewsPopups = ({ ...props }: NewsPopupsProps) => {
    const { open, handleSubmit, setOpen, secondaryHref } = props;
    return (
        <div className="flex justify-end gap-4">
            <Popup
                title={popupCancel.title}
                description={popupCancel.description}
                href={secondaryHref}
            >
                <Button variant="outline">Cancelar</Button>
            </Popup>
            <Button type="submit">Publicar</Button>
            <PopupState
                title={popupPublic.title}
                description={popupPublic.description}
                openState={open}
                onClose={() => {
                    setOpen(false);
                }}
                onConfirm={handleSubmit}
            />
        </div>
    );
};

export default NewsPopups;
