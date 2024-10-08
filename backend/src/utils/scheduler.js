import schedule from "node-schedule";
import workerPool from "./workers/workerPool.js";

/**
 * Schedules a job to run at a specific interval.
 *
 * This function utilizes the `schedule` module to create a scheduled job.
 * The job executes the `programmedRecord` function within the `workerPool` at the defined interval.
 * The job will run daily at 1:00 AM.
 */
const startScheduledJobs = () => {
    schedule.scheduleJob("0 1 * * *", () => {
        workerPool.run("programmedRecord");
    });
};

export default startScheduledJobs;
