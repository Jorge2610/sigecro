import { Permission } from "../models/permissionsM.js";


/**
 * Handles the HTTP request to retrieve all permissions from the database.
 * Sends the retrieved permissions as a JSON response with a 200 status code.
 * If an error occurs, sends a 503 status code.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} Sends a JSON response with the permissions and a 200 status code,
 * or a 503 status code if an error occurs.
 */
const getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.getPermissions();
        permissions.forEach((permission) => {
            permission.expanded = false;
        });
        res.json(permissions);
    } catch (error) {
        res.sendStatus(503);
    }
};

export { getAllPermissions };
