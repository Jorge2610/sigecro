const monthsMap = new Map();
monthsMap.set("enero", "01");
monthsMap.set("febrero", "02");
monthsMap.set("marzo", "03");
monthsMap.set("abril", "04");
monthsMap.set("mayo", "05");
monthsMap.set("junio", "06");
monthsMap.set("julio", "07");
monthsMap.set("agosto", "08");
monthsMap.set("septiembre", "09");
monthsMap.set("octubre", "10");
monthsMap.set("noviembre", "11");
monthsMap.set("diciembre", "12");

/**
 * Obtiene los datos de la noticia desde El Deber.
 *
 * @param {cheerio.CheerioAPI} $ - Objeto cheerio.
 * @return {JSON} - La información de la noticia.
 */
const getElDeberData = ($) => {
    const title = $("h1").text().trim();
    const dateTime = getDateTime($(".dateNote:first").text().trim());
    const content = getContent($);
    return { title: title, dateTime: dateTime, content: content };
};

/**
 * Obtiene el la fecha de la noticia.
 *
 * @param {string} text - Fecha y hora de la noticia.
 * @return {Date} - La fecha de publicación de la noticia.
 */
const getDateTime = (text) => {
    text = text.split(" ");
    const day = text[0].length > 1 ? text[0].length : "0" + text[0].length;
    const month = monthsMap.get(text[2]);
    const year = text[4][0] + text[4][1] + text[4][2] + text[4][3];
    const hours =
        text[5].length === 5 ? text[5][0] + text[5][1] : "0" + text[5][0];
    const minutes =
        text[5].length === 5
            ? text[5][3] + text[5][4]
            : text[5][2] + text[5][3];
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
};

/**
 * Obtiene el contenido de la noticia.
 *
 * @param {cheerio.CheerioAPI} $ - Objeto cheerio.
 * @return {Date} - El contenido de la noticia.
 */
const getContent = ($) => {
    const content = [];
    $(".text-editor div > p, .text-editor div > h3").each((i, element) => {
        const text = $(element).text().trim();
        if (
            element.attribs.style?.includes("margin:") ||
            element.attribs.style?.includes("color:")
        ) {
            return;
        }
        text.length > 1 && !text.includes("<span") ? content.push(text) : "";
    });
    return content;
};

export { getElDeberData };
