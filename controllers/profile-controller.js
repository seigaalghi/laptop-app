const Joi = require("joi").extend(require("@joi/date"));
const { Profile, Users, Laptop } = require("../models");
const catchHandler = require("../utils/catch-handler");

module.exports = {
  createProfile: async (req, res) => {
    const body = req.body;
    const user = req.user;
    try {
      const schema = Joi.object({
        phone: Joi.number(),  
        dateOfBirth: Joi.date().format("YYYY-MM-DD HH:mm:ss"),
        address: Joi.string(),
      });
      const { error } = schema.validate(body);
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
          result: {},
        });
      }

      const check = await Profile.findOne({
        where: {
          userId: user.id,
        },
      });

      if (check) {
        return res.status(400).json({
          status: "Bad Request",
          message: "You have already created a profile before",
          result: {},
        });
      }

      const profile = await Profile.create({
        ...body,
        userId: user.id,
      });

      return res.status(201).json({
        status: "success",
        message: "Successfuly create a profile",
        result: profile,
      });
    } catch (error) {
      catchHandler(res, error);
    }
  },
  getProfile: async (req, res) => {
    const user = req.user;
    console.log(user);
    try {
      const profile = await Profile.findOne({
        where: {
          userId: user.id,
        },
        attributes: {
          exclude: ["userId", "createdAt", "updatedAt"],
        },
        include: [
          {
            model: Users,
            as: "user",
            attributes: {
              exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
            },
            include: [
              {
                model: Laptop,
                as: "likedLaptops",
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
                through: { attributes: [] },
              },
            ],
          },
        ],
      });
      if (!profile) {
        return res.status(404).json({
          status: "Not Found",
          message: "Profile not found",
          result: {},
        });
      }
      res.status(200).json({
        status: "success",
        message: "Successfuly retrieve the profile",
        result: profile,
      });
    } catch (error) {
      catchHandler(res, error);
    }
  },
};
