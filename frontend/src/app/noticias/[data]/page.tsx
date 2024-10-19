import NewsView from "@/components/ui/news-view";
import { getNews } from "@/lib/api/news";

const NewsPage = async ({ params }: { params: { data: string } }) => {
    const splitedData = params.data.split("_");
    const id = splitedData[splitedData.length - 1];
    const news = await getNews(id);
    return (
        <div className="flex justify-center">
            <div className="max-w-[1024px]">
                <NewsView newsData={news} />
            </div>
        </div>
    );
};

export default NewsPage;
