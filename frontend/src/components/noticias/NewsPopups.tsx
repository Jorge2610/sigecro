import { Button } from "../ui/button";
import { Popup, PopupState } from "../ui/popup";
import { popupCancel, popupPublic } from "@/data/newsMessages";
import { usePopup } from "@/hooks/news/usePopup";

interface NewsPopupsProps {
    open: boolean;
    submitData: () => Promise<void>;
    setOpen: (state: boolean) => void;
}

const NewsPopups = ({ open, submitData, setOpen }: NewsPopupsProps) => {
    return (
        <div className="flex justify-end gap-4">
            <Popup
                title={popupCancel.title}
                description={popupCancel.description}
                href="/administrar-noticias/registro/asistido"
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
                onConfirm={submitData}
            />
        </div>
    );
};

export default NewsPopups;
