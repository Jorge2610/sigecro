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

export { capitalizeWords };
