const express = require("express");
const router = express.Router();
const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brand-controller");
const { isLogin, isAdmin } = require("../middlewares/auth");

router.post("/", isAdmin, createBrand);
router.get("/", isLogin, getBrands);
router.get("/:brandId", isLogin, getBrand);
router.put("/:brandId", isAdmin, updateBrand);
router.delete("/:brandId", isAdmin, deleteBrand);

module.exports = router;
