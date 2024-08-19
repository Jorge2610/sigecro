import { Permission } from "../models/permissionsM.js";

const getAllPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.getPermissions();
    permissions.forEach((permission) => {
      permission.expanded = false;
    });
    res.json(permissions);
  } catch (error) {
    next(error);
  }
};

export { getAllPermissions };
