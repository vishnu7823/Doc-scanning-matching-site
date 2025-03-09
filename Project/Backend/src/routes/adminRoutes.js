const express = require("express");
const { getAdminAnalytics } = require("../Controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/analytics", authMiddleware, getAdminAnalytics);

module.exports = router;
