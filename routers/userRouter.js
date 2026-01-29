const express = require("express");
const router = express.Router();
const { signUp, getUsers, login } = require("../controllers/userControllers");
const authMiddleWare = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/signup", signUp);
router.post("/login", login);
router.get("/users", getUsers);

module.exports = router;
