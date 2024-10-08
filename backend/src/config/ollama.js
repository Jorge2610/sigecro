import axios from "axios";

/**
 * Sends a prompt to the Ollama API and returns the response.
 *
 * @async
 * @param {string} prompt - The text prompt to be sent to the Ollama API.
 * @returns {Promise<any>} A Promise that resolves to the response data from the Ollama API.
 * @throws {Error} Throws an error if there's an issue connecting to the Ollama API.
 */
const queryOllama = async (prompt) => {
    try {
        const queryPrompt = {
            model: process.env.MODEL_OLLAMA,
            prompt: prompt,
            stream: false,
        };
        const response = await axios.post(process.env.API_OLLAMA, queryPrompt);
        return response.data;
    } catch (error) {
        console.error("CONNECTION ERROR ON ollama.queryOllama");
        throw error;
    }
};

export { queryOllama };
