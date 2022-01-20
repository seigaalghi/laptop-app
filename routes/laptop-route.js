const express = require("express");
const router = express.Router();
const { createLaptop, getLaptops } = require("../controllers/laptop-controller");
const { isAdmin, isLogin } = require("../middlewares/auth");
const { uploadLocal , uploadCloud } = require("../middlewares/fileUpload");
const resize = require('../middlewares/resize')

router.post("/", isAdmin, uploadLocal('image'), resize, createLaptop);
router.get("/", isLogin, getLaptops)

module.exports = router;
