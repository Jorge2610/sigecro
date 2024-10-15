import { Form } from "@/components/ui/form";
import {
    InputTextAreaForm,
    InputFileForm,
    InputTagsForm,
} from "../../ui/inputsForm";
import messages from "../newsMessages.json";
import { AssistedRecordNews } from "@/types/newsType";
import { useNews } from "@/hooks/useNews";
import { usePopup } from "@/hooks/news/usePopup";
import { useTags } from "@/hooks/news/useTags";
import { useImageUrl } from "@/hooks/news/useImageUrl";
import { getFormatedContent } from "@/lib/stringsUtil";
import SummaryButtons from "../SummaryButtons";
import TagButton from "../TagButton";
import NewsPopups from "../NewsPopups";

interface AssistedFormProps {
    newsData: AssistedRecordNews;
    setImageUrl: (url: string) => void;
}

const AssistedRecordForm = ({ ...props }: AssistedFormProps) => {
    const { newsData, setImageUrl } = props;
    const { form, submitData } = useNews(newsData);
    const { open, handleOpen, onSubmit } = usePopup(submitData);
    const { tags, handleTags, handleDuplicatedTags } = useTags(form, "tags");
    const { handleUpdateUrl } = useImageUrl(setImageUrl, () => {
        return form.getValues().image;
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(() => handleOpen(true))}
                className="space-y-4"
            >
                <InputFileForm
                    name="image"
                    label={messages.image.label}
                    control={form.control}
                    nameImage={form.getValues().image?.name}
                    updateImage={handleUpdateUrl}
                />
                <InputTextAreaForm
                    name="summary"
                    label="Resumen *"
                    control={form.control}
                    rows={5}
                    placeholder="Escriba el resumen..."
                />
                <SummaryButtons
                    control={form.control}
                    content={newsData.content}
                    name="summary"
                />
                <InputTagsForm
                    setDuplicatedTags={handleDuplicatedTags}
                    control={form.control}
                    name="tags"
                    label={messages.tags.label}
                    tags={tags}
                    setTags={handleTags}
                />
                <TagButton
                    content={getFormatedContent(newsData.content)}
                    setTags={handleTags}
                    tagsCount={tags.length}
                />
                <NewsPopups
                    open={open}
                    setOpen={handleOpen}
                    handleSubmit={onSubmit}
                    secondaryHref="/administrar-noticias/registro/asistido"
                />
            </form>
        </Form>
    );
};

export default AssistedRecordForm;
