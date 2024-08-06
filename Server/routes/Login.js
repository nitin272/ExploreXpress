const express = require('express');
const router = express.Router();
const userController = require("../controller/UserController");
const cors = require('cors');
const upload  = require('../middleware/upload');
router.use(cors());

// User authentication routes
router.post("/auth/signup", userController.signup);
router.post("/auth/login", userController.login);

// User management routes
router.get("/users", userController.getAllUsers);
router.get("/user/:userId", userController.getUserById);
router.post("/verify-password", userController.verifyPassword);
router.put("/user/:userId", userController.updateUser);





router.post('/users/:userId/profileImage', upload.single('profileImage'), userController.uploadProfileImage);
router.delete('/users/:userId/profileImage', userController.deleteProfileImage);

router.post('/users/:userId/cover-image', upload.single('coverImage'), userController.uploadCoverImage);
router.delete('/users/:userId/cover-image', userController.deleteCoverImage);


module.exports = router;
