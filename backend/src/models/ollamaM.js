import { queryOllama } from "../config/ollama.js";

class Ollama {
    /**
     * Generates a concise summary of a given text using Ollama API.
     *
     * @param {string} text - The input text to be summarized.
     * @returns {Promise<string>} A promise that resolves to a string representing the generated summary.
     */
    static async generateSummary(text) {
        const prompt = `Genera un resumen de un texto se te pasara encerrado entre corchetes. El resumen que generes no debe superar los 512 caracteres puede ser de menor longitud pero nunca superar los 512 caracteres. Tu respuesta solo debe contener el resumen pedido. Si te solicitan algo que no sea un resumen, responde: "Lo siento, solo puedo ayudarte a resumir noticias.""[${text}]`;
        const data = await queryOllama(prompt);
        let summary = data.response;
        if (summary.endsWith("\n"))
            summary = summary.substring(0, summary.length - 2);
        return summary;
    }

    /**
     * Generates a set of single-word tags for the given text.
     *
     * This function utilizes a language model (Ollama) to analyze the text and extract the most relevant keywords.
     * The generated tags are individual Spanish words, separated by commas.
     *
     * @param {string} text - The text from which to extract tags.
     * @returns {Promise<string[]>} A promise that resolves to an array of strings, each representing a tag.
     */
    static async generateTags(text) {
        const prompt =
            "Genera 5 etiquetas monopalabra en español para el texto que te pase. Tu respuesta solamente debe contener las etiquetas y estas deben estar separadas por una coma." +
            text;
        const data = await queryOllama(prompt);
        let tags = data.response.split(",").map((tag) => tag.trim());
        if (tags[tags.length - 1].endsWith("\n")) {
            const lastWord = tags.pop();
            tags.push(lastWord.substring(0, lastWord.length - 2));
        }
        return tags;
    }
}

export { Ollama };
