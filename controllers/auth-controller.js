const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { Users, PasswordReset } = require("../models");
const bcrypt = require("bcrypt");
const catchHandler = require("../utils/catch-handler");
const random = require("randomstring");
const sendMail = require("../utils/mail-sender");

module.exports = {
  register: async (req, res) => {
    const body = req.body;
    try {
      // validasi data yang dikirim dari body
      const schema = Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        password: Joi.string().min(6).required(),
      });
      const { error } = schema.validate(body);
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
          result: {},
        });
      }
      // check ke database apakah email user sudah digunakan
      const check = await Users.findOne({
        where: {
          email: body.email,
        },
      });
      if (check) {
        return res.status(400).json({
          status: "Bad Request",
          message: "Email already exist, please register with different email or login",
          result: {},
        });
      }
      // mengenkripsi password menggunakan bcrpyt
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const user = await Users.create({
        name: body.name,
        email: body.email,
        password: hashedPassword,
      });

      // meng-generate token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.SECRET_TOKEN,
        { expiresIn: 60 * 60 * 12 }
      );

      // mengembalikan token sebagai response
      res.status(200).json({
        status: "success",
        message: "Registered successfuly",
        result: {
          token: token,
        },
      });
    } catch (error) {
      catchHandler(res, error);
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      // validasi data yang dikirimkan lewat body
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
          result: {},
        });
      }
      // cari user dengan email yang sama dengan yang dikirimkan oleh user
      const user = await Users.findOne({ where: { email } });
      // kalau tidak ada, maka kirimkan invalid email or password
      if (!user) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "Invalid email or password",
          result: {},
        });
      }
      // compare password yang dikirimkan user dengan password yang sudah dihash di database
      const isValid = await bcrypt.compare(password, user.password);
      // kalau compare tidak valid, maka kirimkan invalid email or password
      if (!isValid) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "Invalid email or password",
          result: {},
        });
      }
      // membuat token baru untuk user yang berhasil login
      const token = jwt.sign({ email: user.email, id: user.id }, process.env.SECRET_TOKEN, {
        expiresIn: "12h",
      });

      res.status(200).json({
        status: "success",
        message: "Logged in successfuly",
        result: {
          token,
        },
      });
    } catch (error) {
      catchHandler(res, error);
    }
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await Users.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({
          status: "Not Found",
          message: "Invalid email, user with that email is not found",
          result: {},
        });
      }
      const passwordReset = await PasswordReset.create({
        email,
        validationCode: random.generate(50),
        isDone: false,
      });
      sendMail(
        email,
        "Password Reset",
        `
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                          <a href="https://laptop-app.com" title="logo" target="_blank">
                            <img width="60" src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png" title="logo" alt="logo">
                          </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.
                                        </p>
                                        <a href="https://localhost:5000/api/v1/auth/forgot?code=${passwordReset.validationCode}"
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.laptop-app.com</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>
      `
      );

      res.status(200).json({
        status: "success",
        message: "We've sent you an email to confirm your password reset",
        result: {},
      });
    } catch (error) {
      catchHandler(res, error);
    }
  },
  resetPassword: async (req, res) => {
    const { validationCode, password } = req.body;
    try {
      const schema = Joi.object({
        password: Joi.string().min(6).required(),
        validationCode: Joi.string().required,
      });
      const { error } = schema.validate();
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
          result: {},
        });
      }
      const validate = await PasswordReset.findOne({ where: { validationCode, isDone: false } });
      if (!validate) {
        return res.status(404).json({
          status: "Not Found",
          message: "Invalid validation code confirmation",
          result: {},
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await Users.update({ password: hashedPassword }, { where: { email: validate.email } });

      await PasswordReset.update({ isDone: true }, { where: { validationCode } });

      res.status(200).json({
        status: "success",
        message: "Successfuly change the password",
        result: {},
      });
    } catch (error) {
      catchHandler(res, error);
    }
  },
};
