const express = require("express");

const PageController = require("../controllers/page");

const router = express.Router();

router.post("/pages", PageController.create);
router.get("/pages", PageController.getAll);
router.get("/pages/:login", PageController.getPagesByUserLogin);
router.delete("/pages/:id", PageController.deletePage)

module.exports = router;