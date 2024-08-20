import axios from "axios";
import * as cheerio from "cheerio";
import { getLosTiemposData } from "./losTiempos.js";
import { getOpinionData } from "./opinion.js";
import { getElDeberData } from "./elDeber.js";

const newsScraping = async (url) => {
  const source = getSource(url);
  const newsData = await getNewsData(url, source);
  newsData.source = source;
  newsData.url = url;
  return newsData;
};

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
