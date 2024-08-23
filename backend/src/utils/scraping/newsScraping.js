import axios from "axios";
import * as cheerio from "cheerio";
import { getLosTiemposData } from "./losTiempos.js";
import { getOpinionData } from "./opinion.js";
import { getElDeberData } from "./elDeber.js";

/**
 * Obtiene la informacion de la noticia.
 *
 * @param {string} url - URL de la noticia.
 * @return {JSON} - La información de la noticia.
 */
const newsScraping = async (url) => {
  const source = getSource(url);
  const newsData = await getNewsData(url, source);
  newsData.source = source;
  newsData.url = url;
  return newsData;
};

/**
 * Determina la fuente de la noticia a partir de la URL.
 *
 * @param {string} url - URL de la noticia.
 * @return {string} - La fuente de la noticia.
 */
const getSource = (url) => {
  if (url.includes("lostiempos")) {
    return "Los Tiempos";
  }
  if (url.includes("opinion")) {
    return "Opinión";
  }
  if (url.includes("eldeber")) {
    return "El Deber";
  }
  return "Otros";
};

/**
 * Realiza la peticion HTTP del contenido mediante la URL.
 *
 * @param {string} url - URL de la noticia.
 * @param {string} source - Fuente de la noticia.
 * @return {JSON} - La información de la noticia.
 */
const getNewsData = async (url, source) => {
  const $ = await axios
    .get(url)
    .then((response) => {
      return cheerio.load(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  return getData(source, $);
};

/**
 * Obtiene los datos de la noticia segun la fuente de la misma.
 *
 * @param {string} source - Fuente de la noticia.
 * @param {cheerio.CheerioAPI} $ - Objeto cheerio.
 * @return {JSON} - La información de la noticia.
 */
const getData = (source, $) => {
  switch (source) {
    case "Los Tiempos":
      return getLosTiemposData($);
    case "Opinión":
      return getOpinionData($);
    case "El Deber":
      return getElDeberData($);
  }
};

export { newsScraping };
