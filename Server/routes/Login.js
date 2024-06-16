const express = require('express');
const router = express.Router();
const userController = require("../controller/UserController");
const cors = require('cors');

router.use(cors());

// User authentication routes
router.post("/auth/signup", userController.signup);
router.post("/auth/login", userController.login);

// User management routes
router.get("/users", userController.getAllUsers);
router.get("/user/:userId", userController.getUserById);
router.post("/verify-password", userController.verifyPassword);
router.put("/user/:userId", userController.updateUser);


module.exports = router;
