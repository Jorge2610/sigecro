"use server";
import axios from "axios";

/**
 * Recupera una lista de todas las categorias desde la API.
 *
 * @return {Promise<any>} Una promesa que devuelve la lista de categorias.
 */
const getAllCategories = async (): Promise<any> => {
  try {
    const response = await axios.get("http://localhost:3001/api/categories");
    return response.data.rows;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Envia los datos de una noticia a la API.
 *
 * @param {any} data - los datos de la noticia a ser enviada.
 * @return {Promise<any>} Un objeto con la respuesta de la API.
 */
const postNews = async (data: any): Promise<any> => {
  try {
    const response = await axios.post("http://localhost:3001/api/news", data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.log(error);
  }
};

export { getAllCategories, postNews };
