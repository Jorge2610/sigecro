import { parentPort } from "worker_threads";
import { getData, processURLs } from "../scraping/newsScraping.js";

/**
 * Handles messages received from the main thread.
 * The message should contain a task name and the corresponding arguments.
 * The worker executes the task and sends the result back to the main thread.
 *
 * @param {Object} message - The message received from the worker pool.
 * @param {string} message.taskName - The name of the task to be executed.
 * @param {Array<any>} message.args - The arguments to pass to the task function.
 */
parentPort.on("message", async ({ taskName, args }) => {
    let result;
    switch (taskName) {
        case "urlScraping":
            result = getData(...args);
            break;
        case "processURLs":
            result = await processURLs();
            break;
        default:
            result = "Task not supported";
    }
    parentPort.postMessage(result);
});
