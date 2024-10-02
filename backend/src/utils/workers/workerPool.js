import { Worker } from "worker_threads";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WorkerPool {
    /**
     * @property {Array<Object>} queue - Queue of tasks waiting to be processed.
     * Each task is an object containing taskName, args, resolve, and reject.
     */
    #queue;
    /**
     * @property {Array<Worker>} workers - Array of all active worker threads.
     */
    #workers;
    /**
     * @property {Array<Worker>} freeWorkers - Array of available (idle) workers ready for tasks.
     */
    #freeWorkers;

    /**
     * Creates an instance of WorkerPool.
     * Initializes workers and prepares a queue for task processing.
     *
     * @param {number} numThreads - The number of worker threads to create in the pool.
     */
    constructor(numThreads) {
        this.#queue = [];
        this.#workers = [];
        this.#freeWorkers = [];
        this.processingURLs = false;
        for (let i = 0; i < numThreads; i++) {
            this.#addNewWorker();
        }
    }

    /**
     * Adds a new worker to the pool and attaches event listeners for messages and errors.
     * Each worker is added to the `workers` and `freeWorkers` arrays.
     */
    #addNewWorker = () => {
        const workerPath = path.resolve(__dirname, "./worker.js");
        try {
            const worker = new Worker(workerPath);
            worker.currentJob = null;

            worker.on("message", (result) => {
                const job = worker.currentJob;
                if (job.taskName === "processURLs") {
                    this.processingURLs = false;
                } else if (
                    !this.processingURLs &&
                    job.taskName === "programmedRecord"
                ) {
                    this.run("processURLs");
                }
                job.resolve(result);
                worker.currentJob = null;
                this.#freeWorkers.push(worker);
                this.#processQueue();
            });

            worker.on("error", (error) => {
                console.error("Worker error", error);
                const job = worker.currentJob;
                job.reject(new Error(error));
                this.#workers = this.#workers.filter((w) => w !== worker);
                worker.terminate();
                this.#addNewWorker();
            });

            this.#workers.push(worker);
            this.#freeWorkers.push(worker);
        } catch (error) {
            console.error("Error al crear el worker:", error);
        }
    };

    /**
     * Runs a task by assigning it to an available worker or queues it if none are available.
     *
     * @param {string} taskName - The name of the task to be executed.
     * @param {...any} args - Arguments for the task function.
     * @returns {Promise<any>} - A promise that resolves with the result of the task.
     */
    run = async (taskName, ...args) => {
        return new Promise((resolve, reject) => {
            this.#queue.push({ taskName, args, resolve, reject });
            this.#processQueue();
        });
    };

    /**
     * Processes the task queue by assigning tasks to available workers.
     * If there are free workers and pending tasks, it sends a task to a worker.
     */
    #processQueue = () => {
        if (this.#freeWorkers.length > 0 && this.#queue.length > 0) {
            const worker = this.#freeWorkers.pop();
            const job = this.#queue.shift();
            worker.currentJob = job;
            if (job.taskName === "processURLs") {
                this.processingURLs = true;
            }
            worker.postMessage({
                taskName: job.taskName,
                args: job.args,
            });
        }
    };

    /**
     * Closes all workers in the pool by terminating their threads.
     * This should be called when the pool is no longer needed to free up resources.
     */
    close = () => {
        for (const worker of this.#workers) {
            worker.terminate();
        }
    };
}

const workerPool = new WorkerPool(3);
workerPool.run("programmedRecord");

export default workerPool;
