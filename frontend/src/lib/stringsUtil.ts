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
 * Trunca un texto dado a una longitud especificada.
 *
 * @param {string} text - La entrada de texto a ser truncada.
 * @param {number} length - La longitud de la cadena truncada.
 * @return {string} El texto truncado.
 */

const truncateText = (text: string, length: number): string => {
    if (text.length > length) {
        return text.substring(0, length) + "...";
    }
    return text;
};

export { capitalizeWords, splitIntoParagraphs, truncateText };
