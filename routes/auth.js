const express = require("express");

const AuthController = require("../controllers/auth");

const router = express.Router();

router.post("/singup", AuthController.singup);
router.post("/singin", AuthController.singin);

module.exports = router;