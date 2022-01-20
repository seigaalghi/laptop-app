const multer = require("multer");
const sharp = require("sharp");
const catchHandler = require("../utils/catch-handler");

module.exports = async (req, res, next) => {
  try {
    const file = await sharp(req.file.buffer)
      .resize(500, 500)
      .toFile("public/" + req.file.originalname);

    req.body.image = "/public/" + req.file.originalname;
    next();
  } catch (error) {
    catchHandler(res, error);
  }
};
