import multer from "multer";

const storage = multer.memoryStorage();

/**
 * File filter function for Multer to check if the uploaded file is an image.
 *
 * @param {object} req - The request object.
 * @param {object} file - The file object to be checked.
 * @param {function} cb - The callback function to return the result.
 * @return {void}
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

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 2,
    },
    filefilter,
});

export { upload };
