const express = require("express");

const UserController = require("../controllers/user");


const router = express.Router();

router.get("/current-user", UserController.getCurrentUser);
router.get("/all-users", UserController.getAllUsers);
router.patch("/make-admin/:userId", UserController.makeAdmin);
router.patch("/block-user/:userId", UserController.blockUser);

module.exports = router;
