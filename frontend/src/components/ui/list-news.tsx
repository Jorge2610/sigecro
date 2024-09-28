import CardNews from "./card-news";
import { News } from "../noticias/newsInterfaces";

type ListNewsProps = {
    news: News[];
};
const ListNews = ({ news }: ListNewsProps) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 rows-auto-fr">
            {news.map((news, index) => (
                <div key={index}>
                    <CardNews data={news} />
                </div>
            ))}
        </div>
    );
};
export default ListNews;
