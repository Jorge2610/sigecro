import URLs from "../models/urlsM.js";
import workerPool from "../utils/workers/WorkerPool.js";

/**
 * Processes a batch of URLs from the request body, prepares them for insertion into the database,
 * and executes a batch insert operation.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Sends an HTTP status code in the response after attempting to insert the URLs.
 */
const setURLsBatch = async (req, res) => {
    if (req.body.urls === "") {
        res.sendStatus(503);
        return;
    }
    const urls = req.body.urls.split("\n");
    let valuesPlaceholders = "";
    for (let i = 0; i < urls.length; i++) {
        urls[i] = [urls[i], req.body.user_id, req.body.category_id];
        valuesPlaceholders += `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`;
        if (i < urls.length - 1) {
            valuesPlaceholders += ", ";
        }
    }
    const values = urls.flat();
    const result = await URLs.setURLsBatch(valuesPlaceholders, values);
    if (result === 200 && !workerPool.processingURLs) {
        workerPool.run("processURLs");
    }
    res.sendStatus(result);
};

/**
 * Handles the HTTP request to retrieve all URLs from the database.
 * Sends the retrieved URLs as a JSON response.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} Sends a JSON response with the URLs and a 200 status code,
 * or a 503 status code if an error occurs.
 */
const getURLsBatch = async (req, res) => {
    try {
        const result = await URLs.getURLs();
        res.status(200).json(result);
    } catch (error) {
        res.sendStatus(503);
    }
};

/**
 * Handles the HTTP request to delete multiple URLs based on their IDs.
 * Sends a 204 status code if the deletion is successful, or a 503 status code if an error occurs.
 *
 * @param {Object} req - The Express request object, containing the `ids` array in the body.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} Sends a 204 status code if the URLs are successfully deleted,
 * or a 503 status code if an error occurs.
 */
const deleteURLs = async (req, res) => {
    try {
        const ids = req.body.ids;
        await URLs.deleteURLs(ids);
        res.sendStatus(204);
    } catch (error) {
        res.sendStatus(503);
    }
};

export { setURLsBatch, getURLsBatch, deleteURLs };
