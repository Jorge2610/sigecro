const { Router } = require('express');
const router = Router();
const permissionsController = require('../controllers/permissionsController');

router.get('/', permissionsController.getAllPermissions);

module.exports = router;