interface News {
    id: string;
    title: string;
    content: Array<string>;
    date: Date;
    source: string;
    url?: string;
    summary: string;
    image_url?: string;
    status: string;
    category_id: string;
    category_name: string;
    user_id: string;
    tags?: Array<string>;
    total_count: number;
}

type AssistedRecordNews = Pick<
    News,
    "url" | "title" | "date" | "source" | "content" | "category_id"
>;

type NewsData = Omit<News, "id" | "total_count" | "image_url"> & {
    image?: File;
};
// type NewsView = Partial<Omit<News, "id" | "total_count">>;
type NewsViewType = Omit<
    News,
    | "id"
    | "total_count"
    | "category_id"
    | "user_id"
    | "status"
    | "summary"
    | "tags"
    | "url"
    | "image_url"
    | "category_name"
> &
    Partial<
        Pick<News, "summary" | "tags" | "url" | "image_url" | "category_name">
    >;

export type { AssistedRecordNews, News, NewsData, NewsViewType };
