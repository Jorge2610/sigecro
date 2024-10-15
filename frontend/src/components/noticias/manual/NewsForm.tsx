"use client";

import React, { useEffect } from "react";
import { splitIntoParagraphs } from "@/lib/stringsUtil";
import {
    InputForm,
    InputDateForm,
    InputTextAreaForm,
    InputSelectForm,
    InputFileForm,
    InputTagsForm,
} from "../../ui/inputsForm";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Popup } from "@/components/ui/popup";
import { useManualNewsContext } from "@/store/ManualNewsProvider";
import { useManualRegister } from "@/hooks/news/useManualRegister";
import SummaryButtons from "../SummaryButtons";
import TagButton from "../TagButton";
import { useTags } from "@/hooks/news/useTags";
import { CategoryType } from "@/types/categoryType";
import {
    title,
    source,
    date,
    content,
    summary,
    url,
    image,
    tag,
    category,
    popupCancel,
} from "@/data/newsMessages";

interface Props {
    categories: CategoryType[];
}
const NewsForm = ({ categories }: Props) => {
    const { newsData } = useManualNewsContext();
    const { form, onSubmit, cleanForm } = useManualRegister(categories);
    const { tags, handleTags, handleDuplicatedTags } = useTags(form, "tags");

    useEffect(() => {
        newsData && form.reset(newsData);
        newsData && handleTags(newsData.tags ?? []);
    }, []);

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <InputForm
                        name="title"
                        label={title.label}
                        control={form.control}
                        placeholder={title.placeholder}
                        max={255}
                    />
                    <InputForm
                        name="source"
                        label={source.label}
                        control={form.control}
                        placeholder={source.placeholder}
                        max={64}
                    />
                    <InputDateForm
                        name="date"
                        label={date.label}
                        control={form.control}
                        placeholder={date.placeholder}
                    />
                    <InputTextAreaForm
                        name="content"
                        label={content.label}
                        control={form.control}
                        rows={10}
                        placeholder={content.placeholder}
                    />
                    <InputTextAreaForm
                        name="summary"
                        label={summary.label}
                        control={form.control}
                        rows={5}
                        placeholder={summary.placeholder}
                        max={768}
                    />
                    <SummaryButtons
                        content={splitIntoParagraphs(form.getValues().content)}
                        control={form.control}
                        name={"summary"}
                    />
                    <InputForm
                        name="url"
                        label={url.label}
                        control={form.control}
                        placeholder={url.placeholder}
                        max={300}
                    />
                    <InputSelectForm
                        name="category_id"
                        label={category.label}
                        control={form.control}
                        placeholder={category.placeholder}
                        array={categories}
                    />
                    <InputFileForm
                        name="image"
                        label={image.label}
                        control={form.control}
                        nameImage={form.getValues().image?.name}
                    />
                    <InputTagsForm
                        setDuplicatedTags={handleDuplicatedTags}
                        control={form.control}
                        name="tags"
                        label={tag.label}
                        tags={tags}
                        setTags={handleTags}
                    />
                    <TagButton
                        content={form.getValues().content}
                        setTags={handleTags}
                        tagsCount={tags.length}
                    />
                    <FormButtons cleanForm={cleanForm} />
                </form>
            </Form>
        </>
    );
};

interface FormButtonsProps {
    cleanForm: () => void;
}

const FormButtons = ({ cleanForm }: FormButtonsProps) => {
    return (
        <div className="flex justify-end gap-4">
            <Popup
                title={popupCancel.title}
                description={popupCancel.description}
                action={cleanForm}
                href="/administrar-noticias"
            >
                <Button variant="outline">Cancelar</Button>
            </Popup>
            <Button type="submit"> Previsualizar </Button>
        </div>
    );
};

export default NewsForm;
