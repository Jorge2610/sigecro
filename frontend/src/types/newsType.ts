interface NewsData {
    url: string;
    title: string;
    dateTime: Date;
    source: string;
    content: Array<string>;
    category_id: string;
}

interface News {
    id: number;
    title: string;
    content: string;
    date: string;
    source: string;
    url: string;
    summary: string;
    image_url: string;
    status: string;
    category_id: number;
    category_name: string;
    user_id: number;
    tags: Array<string>;
    total_count: number;
}

interface Category {
    id: number | null;
    name: string;
}

const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/jpeg",
    "image/webp",
];

export type { NewsData, News, Category };

export { ACCEPTED_IMAGE_TYPES };
