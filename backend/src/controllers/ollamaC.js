import { Ollama } from "../models/ollamaM.js";

/**
 * Generates a summary of a given text using the Ollama API.
 *
 * @async
 * @param {Request} req - Express request object containing the text to summarize in req.query.text.
 * @param {Response} res - Express response object.
 */
const getSummary = async (req, res) => {
    try {
        const content = req.body.content;
        const summary = await Ollama.generateSummary(content);
        res.json(summary);
    } catch (error) {
        console.error("ERROR ON ollama.getSummary");
        res.sendStatus(500);
    }
};

/**
 * Generates tags for a given text using the Ollama API.
 *
 * @async
 * @param {Request} req - Express request object containing the text to generate tags for in req.query.text.
 * @param {Response} res - Express response object.
 */
const getTags = async (req, res) => {
    try {
        const content = req.body.content;
        const tags = await Ollama.generateTags(content);
        res.json(tags);
    } catch (error) {
        console.error("ERROR ON ollama.getTags");
        res.sendStatus(500);
    }
};

export { getSummary, getTags };
