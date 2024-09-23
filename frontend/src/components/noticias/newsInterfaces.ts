interface NewsData {
    url: string;
    title: string;
    dateTime: Date;
    source: string;
    content: Array<string>;
    category_id: string;
}

const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/jpeg",
    "image/webp",
];

export type { NewsData };

export { ACCEPTED_IMAGE_TYPES };
