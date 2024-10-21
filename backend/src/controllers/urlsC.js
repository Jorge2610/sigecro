import URLs from "../models/urlsM.js";
import workerPool from "../utils/workers/workerPool.js";

/**
 * Adds a batch of URLs to the database for processing.
 *
 * @async
 * @param {Request} req - Express request object containing a newline-separated list of URLs in req.body.urls.
 * @param {Response} res - Express response object.
 *
 * **Note:** This function expects the URLs to be provided as a newline-separated string in req.body.urls.
 */
const setURLsBatch = async (req, res) => {
    if (req.body.urls === "") {
        res.sendStatus(500);
        return;
    }
    const urls = req.body.urls.split("\n");
    const valuesPlaceholders = getPlaceHolders(
        urls,
        req.body.user_id,
        req.body.category_id
    );
    const values = urls.flat();
    try {
        await URLs.setURLsBatch(valuesPlaceholders, values);
        if (!workerPool.processingURLs) {
            workerPool.run("processURLs");
        }
        res.sendStatus(201);
    } catch (error) {
        console.error("ERROR ON urls.setURLsBatch");
        res.sendStatus(503);
    }
};

/**
 * Retrieves a batch of URLs from the database.
 *
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
const getURLsBatch = async (req, res) => {
    try {
        const result = await URLs.getURLs();
        res.json(result);
    } catch (error) {
        console.error("ERROR ON urls.getURLsBatch");
        res.sendStatus(503);
    }
};

/**
 * Deletes a batch of URLs from the database.
 *
 * @async
 * @param {Request} req - Express request object containing an array of URL IDs in req.body.ids.
 * @param {Response} res - Express response object.
 */
const deleteURLs = async (req, res) => {
    try {
        const ids = req.body.ids;
        await URLs.deleteURLs(ids);
        res.sendStatus(204);
    } catch (error) {
        console.error("ERROR ON urls.deleteURLs");
        res.sendStatus(503);
    }
};

/**
 * Generates placeholder strings for a batch of URLs.
 *
 * @param {string[]} urls - An array of URLs.
 * @param {number} userId - The ID of the user.
 * @param {number} categoryId - The ID of the category.
 * @returns {string} A string containing placeholders for the URLs, user ID, and category ID.
 */
const getPlaceHolders = (urls, userId, categoryId) => {
    let valuesPlaceholders = "";
    for (let i = 0; i < urls.length; i++) {
        urls[i] = [urls[i], userId, categoryId];
        valuesPlaceholders += `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`;
        if (i < urls.length - 1) {
            valuesPlaceholders += ", ";
        }
    }
    return valuesPlaceholders;
};

export { setURLsBatch, getURLsBatch, deleteURLs };
