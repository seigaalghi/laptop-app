const jwt = require("jsonwebtoken");
const catchHandler = require("../utils/catch-handler");
const { Users } = require("../models");

module.exports = {
  isLogin: async (req, res, next) => {
    try {
      // merekam data token dari request (token yang dikirimkan oleh user)
      let token = req.header("Authorization");
      // check apakah token ada?
      if (!token) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "No token detected",
          result: {},
        });
      }
      // menghapus Bearer dari token
      token = token.replace("Bearer ", "");
      // meng-dekripsi token
      const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
      // check ke db, user dengan id berikut
      const user = await Users.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({
          status: "Unauhtorized",
          message: "User not found",
        });
      }
      // mengirimkan data user ke controller selanjutnya
      req.user = {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      };
      // pergi ke controller selanjutnya
      next();
    } catch (error) {
      return res.status(401).json({
        status: "Unauthorized",
        message: error.message,
        result: {},
      });
    }
  },
  isAdmin: async (req, res, next) => {
    try {
      // merekam data token dari request (token yang dikirimkan oleh user)
      let token = req.header("Authorization");
      // check apakah token ada?
      if (!token) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "No token detected",
          result: {},
        });
      }
      // menghapus Bearer dari token
      token = token.replace("Bearer ", "");
      // meng-dekripsi token
      const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
      // check ke db, user dengan id berikut
      const user = await Users.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({
          status: "Unauhtorized",
          message: "User not found",
        });
      }
      // check apakah role user adalah admin
      if (!user.isAdmin) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "You have no right to access this end-point",
          result: {},
        });
      }
      // mengirimkan data user ke controller selanjutnya
      req.user = {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      };
      // pergi ke controller selanjutnya
      next();
    } catch (error) {
      return res.status(401).json({
        status: "Unauthorized",
        message: error.message,
        result: {},
      });
    }
  }
};
