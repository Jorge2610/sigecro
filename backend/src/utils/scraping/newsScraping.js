import * as cheerio from "cheerio";
import { getLosTiemposData } from "./losTiempos.js";
import { getOpinionData } from "./opinion.js";
import { getElDeberData } from "./elDeber.js";

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
 * Obtiene los datos de la noticia segun la fuente de la misma.
 *
 * @param {string} source - Fuente de la noticia.
 * @param {JSON} responseData - JSON data de la respueta axios.
 * @return {JSON} - La información de la noticia.
 */
const getData = (source, responseData) => {
    const $ = cheerio.load(responseData);
    switch (source) {
        case "Los Tiempos":
            return getLosTiemposData($);
        case "Opinión":
            return getOpinionData($);
        case "El Deber":
            return getElDeberData($);
    }
};

export { getData, getSource };
