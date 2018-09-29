const express = require("express");

const PageController = require("../controllers/page");

const router = express.Router();

router.post("/pages", PageController.create);
router.get("/pages", PageController.getAll);

module.exports = router;