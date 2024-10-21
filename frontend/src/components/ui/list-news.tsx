import CardNews from "./card-news";
import { News } from "../../types/newsType";

type ListNewsProps = {
    news: News[];
    viewList: boolean;
};
const ListNews = ({ news, viewList }: ListNewsProps) => {
    return (
        <div
            className={`grid grid-cols-1 ${
                !viewList && "xl:grid-cols-2"
            } gap-6 rows-auto-fr`}
        >
            {news.map((news, index) => (
                <div key={index}>
                    <CardNews data={news} />
                </div>
            ))}
        </div>
    );
};
export default ListNews;
