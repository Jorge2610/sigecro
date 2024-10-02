/**
 * Pauses the execution for a specified amount of time.
 *
 * @param {number} delay - The delay in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the delay has passed.
 */
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export { sleep };
