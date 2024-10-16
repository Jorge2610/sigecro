import { NewsData, NewsViewType } from "@/types/newsType";
import {
    formAsssistedRecord,
    formManualRegister,
} from "@/types/registerSchemas";
import { UseFormReturn } from "react-hook-form";
import { splitIntoParagraphs } from "./stringsUtil";

const formatNewsDataToNewsView = (
    newsData: NewsData,
    assisted: boolean,
    imageUrl?: string
): NewsViewType => {
    const formatedNews: NewsViewType = {
        content: newsData.content,
        date: newsData.date,
        source: newsData.source,
        title: newsData.title,
        category_name: newsData.category_name,
        image_url: imageUrl,
        summary: assisted ? "" : newsData.summary,
        tags: assisted ? [] : newsData.tags,
        url: newsData.url,
    };
    return formatedNews;
};

const assitedFormToNewsData = (
    newsData: NewsData,
    formData: UseFormReturn<formAsssistedRecord>
) => {
    const values = formData.getValues();
    newsData.summary = values.summary;
    newsData.tags = values.tags;
    newsData.image = values.image;
    return newsData;
};

const manualFormToNewsData = (
    newsData: NewsData,
    formData: formManualRegister
) => {
    newsData.category_id = formData.category.id;
    newsData.category_name = formData.category.name;
    newsData.content = splitIntoParagraphs(formData.content);
    newsData.date = formData.date;
    newsData.source = formData.source;
    newsData.summary = formData.summary;
    newsData.title = formData.title;
    newsData.tags = formData.tags;
    newsData.url = formData.url;
    newsData.image = formData.image;
    return newsData;
};

export {
    formatNewsDataToNewsView,
    assitedFormToNewsData,
    manualFormToNewsData,
};
