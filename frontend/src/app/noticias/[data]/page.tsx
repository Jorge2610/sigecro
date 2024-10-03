import axios from "axios";
import api from "@/app/api/apiConfig";
import NewsPreview from "@/components/noticias/manual/NewsPreview"
const Noticia = async ({ params }: { params: { data: string } }) => {
    let responseNews;

    const splitedData = params.data.split("_");
    const id = splitedData[splitedData.length - 1];
    try {
        const response = await api.get(`/news/${id}`);
        responseNews = response.data.data[0];
    } catch (error) {
        //console.log(error);
        responseNews = [];
    }
    console.log(responseNews);
    return responseNews?.length>0 ? <div>holas </div> : <div> no hay </div>;
};

export default Noticia;
