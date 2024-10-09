import api from "@/services/apiConfig";
import {News} from "@/components/noticias/News"
const Noticia = async ({ params }: { params: { data: string } }) => {
    let responseNews;

    const splitedData = params.data.split("_");
    const id = splitedData[splitedData.length - 1];
    try {
        const response = await api.get(`/news/${id}`);
        responseNews = response.data.data;
    } catch (error) {
        //console.log(error);
        responseNews = [];
    }
    console.log(responseNews);
    return responseNews?.length>0 ? <News imageURL={null} data={responseNews[0]}></News> : <div> no hay </div>;
};

export default Noticia;
