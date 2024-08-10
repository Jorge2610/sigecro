const express = require('express');
const router = express.Router();
const permissionsRoutes = require('./permissionsRoutes');

router.use("/permissions", permissionsRoutes);

module.exports = router;