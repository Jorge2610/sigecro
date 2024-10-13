import { te } from "date-fns/locale";

/**
 * Capitaliza la primera letra de cada palabra en una cadena dada.
 *
 * @param {string} text - La entrada de texto a ser capitalizada.
 * @return {string} El texto capitalilzada.
 */
const capitalizeWords = (text: string): string => {
    return text
        .split(" ")
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
};

/**
 *
 * Divide el texto dado en parrafos separado por saltos de linea.
 * Filtra los saltos de linea vacios y devuelve un array de parrafos.
 *
 * @param {string} text - La entrada de texto que sera dividida en parrafos.
 * @return {string[]} Un arreglo de parrafos.
 */
const splitIntoParagraphs = (text: string): string[] => {
    const paragraphs = text.split(/\n+/);
    return paragraphs.filter((paragraph) => paragraph.trim() !== "");
};
/**
 *
 * @param text
 * @returns
 */
const formantNewsTitle = (text: string): string => {
    text = text
        .replaceAll(" ", "-")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    return text;
};

const getFormatedContent = (content: string[]): string => {
    let formatedContent: string = "";
    content.map((paragraph) => {
        formatedContent += paragraph + "\n";
    });
    return formatedContent;
};

export {
    capitalizeWords,
    splitIntoParagraphs,
    formantNewsTitle,
    getFormatedContent,
};
