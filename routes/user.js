const express = require("express");

const UserController = require("../controllers/user");


const router = express.Router();

router.get("/current-user", UserController);

module.exports = router;