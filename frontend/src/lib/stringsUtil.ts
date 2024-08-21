/**
 * Capitaliza la primera letra de cada palabra en una cadena dada.
 *
 * @param {string} text - La entrada de texto a ser capitalizada.
 * @return {string} El texto capitalilzada.
 */
const capitalizeWords = (text: string): string => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Splits the given text into paragraphs by splitting it at double newline characters.
 * Filters out empty paragraphs and returns the resulting array of paragraphs.
 *
 * @param {string} text - The input text to be split into paragraphs.
 * @return {string[]} An array of paragraphs.
 */
const splitIntoParagraphs = (text: string): string[] => {
  const paragraphs = text.split(/\n\n+/);
  return paragraphs.filter(paragraph => paragraph.trim() !== '');
}



export { capitalizeWords, splitIntoParagraphs };
