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
 * Extracts data from an El Deber news article.
 *
 * @param {cheerio.Cheerio} $ - The cheerio.Cheerio object representing the article's HTML.
 * @returns {Object} An object containing the extracted data, including title, date/time, and content.
 */
const getElDeberData = ($) => {
    const title = $("h1").text().trim();
    const dateTime = getDateTime($(".dateNote:first").text().trim());
    const content = getContent($);
    return { title: title, dateTime: dateTime, content: content };
};

/**
 * Extracts date and time from a text string in a specific format.
 *
 * @param {string} text - The text string containing the date and time information.
 * @returns {Date} A Date object representing the extracted date and time.
 */
const getDateTime = (text) => {
    text = text.split(" ");
    const day = text[0].length > 1 ? text[0] : "0" + text[0];
    const month = monthsMap.get(text[2]);
    const year = text[4][0] + text[4][1] + text[4][2] + text[4][3];
    const hours = text[5].split(":")[0].padStart(2, "0");
    const minutes = text[5].split(":")[1].padStart(2, "0");
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
};

/**
 * Extracts the main content from an El Deber news article's HTML.
 *
 * @param {cheerio.Cheerio} $ - The cheerio.Cheerio object representing the article's HTML.
 * @returns {string[]} An array of strings containing the extracted content paragraphs.
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
