import { Permission } from "../models/permissionsM.js";

/**
 * Recupera todos los permisos disponibles en el sistema.
 *
 * @param {object} res - La respuesta HTTP.
 * @return {json} Un JSON con los permisos del sistema.
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
