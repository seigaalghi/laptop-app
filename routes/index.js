const express = require("express");
const router = express.Router();
const brandRoute = require("./brand-route");
const authRoute = require("./auth-route");
const laptopRoute = require("./laptop-route");

router.use("/brand", brandRoute);
router.use("/auth", authRoute);
router.use("/laptop", laptopRoute);

module.exports = router;
