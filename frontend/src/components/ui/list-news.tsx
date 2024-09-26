import CardNews,{CardNewsProps} from './card-news'

type ListNewsProps = {
    news:CardNewsProps[],
}
const ListNews = ({news}:ListNewsProps)=>{

      
    return(<div>
         {news.map((news,index)=>(
            <CardNews 
            key={index}
            title={news.title} 
            source={news.source}
            date={news.date}
            summary={news.summary}
            tags={news.tags}
            />
         ))}
    </div>
    )
}
export default ListNews;