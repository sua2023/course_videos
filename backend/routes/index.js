const express = require("express");
const router = express.Router();
const authRoute = require("./../controller/auth");
const userRoute = require("./../controller/user.controller");

const { authenticateToken } = require("../middleware/jwtToken");

router.post("/auth", authRoute.authLogin);
router.post("/user", authenticateToken, userRoute.createUser);
router.get("/user", authenticateToken, userRoute.getUsers);
router.get("/user/:id", authenticateToken, userRoute.getUserById);
router.put("/user/:id", authenticateToken, userRoute.updateUser);
router.delete("/user", authenticateToken, userRoute.deleteUser);

module.exports = router;
