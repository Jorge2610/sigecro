interface NewsData {
  url: string;
  title: string;
  dateTime: Date;
  source: string;
  content: Array<string>;
}

export type { NewsData };
