import { Form } from "@/components/ui/form";
import {
    InputTextAreaForm,
    InputFileForm,
    InputTagsForm,
} from "../../ui/inputsForm";
import { image, summary, tag } from "@/data/newsMessages";
import { NewsData } from "@/types/newsType";
import { useNews } from "@/hooks/useNews";
import { usePopup } from "@/hooks/news/usePopup";
import { useTags } from "@/hooks/news/useTags";
import { useImageUrl } from "@/hooks/news/useImageUrl";
import { getFormatedContent } from "@/lib/stringsUtil";
import SummaryButtons from "../SummaryButtons";
import TagButton from "../TagButton";
import { useAssistedRegister } from "@/hooks/news/useAssistedRegister";
import { assitedFormToNewsData } from "@/lib/formUtils";
import ButtonsWithPopup from "../../ui/buttons-with-popup";

const POPUP_MESSAGES = {
    primaryTitle: "Publicar",
    primaryDescription: "¿Está seguro de que quiere publicar esta noticia?",
    secondaryTitle: "Cancelar registro",
    secondaryDescription: "Todos los cambios no guardados se perderán",
};

interface AssistedFormProps {
    newsData: NewsData;
    setImageUrl: (url: string) => void;
}

const AssistedRecordForm = ({ ...props }: AssistedFormProps) => {
    const { newsData, setImageUrl } = props;
    const { formPreview } = useAssistedRegister();
    const { submitData } = useNews(
        assitedFormToNewsData(newsData, formPreview)
    );
    const { open, handleOpen, onSubmit } = usePopup(submitData);
    const { tags, handleTags, handleDuplicatedTags } = useTags(
        formPreview,
        "tags"
    );
    const { handleUpdateUrl } = useImageUrl(setImageUrl, () => {
        return formPreview.getValues().image;
    });

    return (
        <Form {...formPreview}>
            <form
                onSubmit={formPreview.handleSubmit(() => handleOpen(true))}
                className="space-y-4"
            >
                <InputFileForm
                    name="image"
                    label={image.label}
                    control={formPreview.control}
                    nameImage={formPreview.getValues().image?.name}
                    updateImage={handleUpdateUrl}
                />
                <InputTextAreaForm
                    name="summary"
                    label={summary.label}
                    control={formPreview.control}
                    rows={5}
                    placeholder={summary.placeholder}
                />
                <SummaryButtons
                    control={formPreview.control}
                    content={newsData.content as string[]}
                    name="summary"
                />
                <InputTagsForm
                    setDuplicatedTags={handleDuplicatedTags}
                    control={formPreview.control}
                    name="tags"
                    label={tag.label}
                    tags={tags}
                    setTags={handleTags}
                />
                <TagButton
                    content={getFormatedContent(newsData.content as string[])}
                    setTags={handleTags}
                    tagsCount={tags.length}
                />
                <ButtonsWithPopup
                    open={open}
                    setOpen={handleOpen}
                    handleSubmit={onSubmit}
                    secondaryHref="/administrar-noticias/registro/asistido"
                    popupsMessages={POPUP_MESSAGES}
                />
            </form>
        </Form>
    );
};

export default AssistedRecordForm;
