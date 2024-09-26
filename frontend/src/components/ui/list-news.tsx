import CardNews from "./card-news";
import { News } from "../noticias/newsInterfaces";

type ListNewsProps = {
    news: News[];
};
const ListNews = ({ news }: ListNewsProps) => {
    console.log(news);
    return (
        <div>
            {news.map((news, index) => (
                <div key={index}>
                    <CardNews data={news} />
                </div>
            ))}
        </div>
    );
};
export default ListNews;
