import axios from "axios";
/**
 * Realiza una consulta al modelo Ollama utilizando un prompt especificado.
 *
 * @param {string} prompt - El texto de entrada que se enviará al modelo Ollama para obtener una respuesta.
 * @returns {Promise<object>} Devuelve una promesa que se resuelve con la respuesta de la API de Ollama o con un objeto de error.
 */
const queryOllama = async (prompt) => {
    const queryPrompt = {
        model: process.env.MODEL_OLLAMA,
        prompt: prompt,
        stream: false,
    };
    try {
        const response = await axios.post(process.env.API_OLLAMA, queryPrompt);
        return response;
    } catch (error) {
 
        if (error.response) {
            return error.response;
        } else {
            return {
                status: 500,
                data: { response: "Error en la solicitud a Ollama" }
            };
        }
    }
};
/**
 * Genera un resumen del texto proporcionado en la consulta HTTP.
 *
 * @param {object} req - El objeto de solicitud HTTP que contiene los parámetros de la consulta.
 * @param {object} res - El objeto de respuesta HTTP que se utiliza para enviar la respuesta al cliente.
 * @param {function} next - La función de middleware que pasa el control al siguiente middleware en la cadena.
 * @returns {Promise<void>} Devuelve un resumen en formato JSON o un mensaje de error en caso de fallo.
 *
 */
const getSummary = async (req, res, next) => {
    const text = req.query.text;
    const prompt = `Genera un resumen de un texto se te pasara encerrado entre corchetes. El resumen que generes no debe superar los 512 caracteres puede ser de menor longitud pero nunca superar los 512 caracteres. Tu respuesta solo debe contener el resumen pedido. Si te solicitan algo que no sea un resumen, responde: "Lo siento, solo puedo ayudarte a resumir noticias.""[${text}]`;
    try {
        const response = await queryOllama(prompt);
        console.log(response.status != 200);
        if (response.status != 200) {
            res.status(500).json({ message: "servidor ollama caido" });
        } else {
            let summary = response.data.response;
            if (summary.endsWith("\n"))
                summary = summary.substring(0, summary.length - 2);
            res.status(200).json({ summary });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        next(error);
    }
};

/**
 * Genera una lista de etiquetas a partir del texto proporcionado en la consulta HTTP.
 *
 * @param {object} req - El objeto de solicitud HTTP que contiene los parámetros de la consulta.
 * @param {object} res - El objeto de respuesta HTTP que se utiliza para enviar la respuesta al cliente.
 * @param {function} next - La función de middleware que pasa el control al siguiente middleware en la cadena.
 * @returns {Promise<void>} Devuelve un JSON con las etiquetas generadas o un mensaje de error en caso de fallo.
 *
 */
const getTags = async (req, res, next) => {
    const text = req.query.text;
    const prompt =
        "Genera 5 etiquetas monopalabra en español para el texto que te pase. Tu respuesta solamente debe contener las etiquetas y estas deben estar separadas por una coma." +
        text;
    try {
        const response = await queryOllama(prompt);
        if (response.status != 200) {
            res.status(500).json({ message: "servidor ollama caido" });
        } else {
            let tags = response.data.response
                .split(",")
                .map((tag) => tag.trim());
            if (tags[tags.length - 1].endsWith("\n")) {
                const lastWord = tags.pop();
                tags.push(lastWord.substring(0, lastWord.length - 2));
            }
            res.status(200).json({ tags });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        next(error);
    }
};
export { getSummary, getTags };
