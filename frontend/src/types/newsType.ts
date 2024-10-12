interface News {
    id: number;
    title: string;
    content: Array<string>;
    date: Date;
    source: string;
    url: string;
    summary: string;
    image_url: string;
    status: string;
    category_id: string;
    category_name: string;
    user_id: number;
    tags: Array<string>;
    total_count: number;
}

type AssistedRecordNews = Pick<
    News,
    "url" | "title" | "date" | "source" | "content" | "category_id"
>;

type FormNews = Omit<News, "id" | "category_name" | "total_count">;

const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/jpeg",
    "image/webp",
];

export type { AssistedRecordNews, News, FormNews };

export { ACCEPTED_IMAGE_TYPES };
