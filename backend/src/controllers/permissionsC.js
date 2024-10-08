import { Permission } from "../models/permissionsM.js";

/**
 * Retrieves a list of all permissions.
 *
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
const getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.getPermissions();
        permissions.forEach((permission) => {
            permission.expanded = false;
        });
        res.json(permissions);
    } catch (error) {
        console.error("ERROR ON permissions.getAllPermissions");
        res.sendStatus(503);
    }
};

export { getAllPermissions };
