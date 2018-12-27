const express = require("express");

const AuthController = require("../controllers/auth");

const router = express.Router();

router.post("/singup", AuthController.singup);
router.post("/singin", AuthController.singin);
router.post("/singInFacebook", AuthController.singInFacebook);
router.get("/confirmation/:token", AuthController.confirmationPost);

module.exports = router;
