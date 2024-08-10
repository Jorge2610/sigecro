const Permissions = require('../models/permissions');

exports.getAllPermissions = async (req, res, next) => {
    try {
        const permissions = Permissions.getAllPermissions();
        res.json(permissions);
    } catch (error) {
        next(error);
    }
};