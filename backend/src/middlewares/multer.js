import multer from "multer";

const storage = multer.memoryStorage();

/**
 * File filter function for multer upload middleware.
 *
 * @param {Request} req - Express request object.
 * @param {File} file - File object containing information about the uploaded file.
 * @param {Callback} cb - Callback function to indicate whether the file is accepted or rejected.
 */
const filefilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/webp"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

/**
 * Creates a multer upload middleware.
 *
 * @param {StorageEngine} storage - The storage engine to use for uploading files.
 * @param {FileLimitsOptions} limits - Optional limits for file size and other parameters.
 * @param {FileFilterCallback} filefilter - Optional file filter function.
 * @returns {Multer} A Multer upload middleware function.
 */
const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 2,
    },
    filefilter,
});

export { upload };
