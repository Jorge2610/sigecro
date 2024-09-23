import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Pauses the execution for a specified amount of time.
 *
 * @param {number} delay - The delay in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the delay has passed.
 */
const sleep = (delay: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, delay));

export { sleep };
