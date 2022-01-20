const Joi = require("joi");
const catchHandler = require("../utils/catch-handler");
const { Laptop, Brand, Users } = require("../models");

module.exports = {
  createLaptop: async (req, res) => {
    const body = req.body;
    try {
      const schema = Joi.object({
        brandId: Joi.number().required(),
        name: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.string().required(),
        stock: Joi.number().required(),
      });
      const { error } = schema.validate({
        ...body,
      });
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
        });
      }

      const laptop = await Laptop.create({
        ...body,
      });

      if (!laptop) {
        return res.status(500).json({
          status: "internal server error",
          message: "Failed to save the data",
          result: {},
        });
      }

      res.status(201).json({
        status: "success",
        message: "Successfuly created laptop",
        result: laptop,
      });
    } catch (error) {
      catchHandler(res, error);
    }
  },
  getLaptops: async (req, res) => {
    try {
      const laptops = await Laptop.findAll({
        limit: 10,
        include: [
          {
            model: Brand,
            as: "brand",
            attributes: {
              exclude: ["updatedAt", "createdAt"],
            },
          },
          {
            model: Users,
            as: "likes",
            attributes: {
              exclude: ["password"],
            },
          },
        ],
        attributes: {
          exclude: ["brandId", "updatedAt", "createdAt"],
        },
      });
      if (laptops.length == 0) {
        return res.status(404).json({
          status: "Not Found",
          message: "Database is empty, data not found",
          result: [],
        });
      }
      res.status(200).json({
        status: "success",
        message: "Successfuly retrieve laptops",
        result: laptops,
      });
    } catch (error) {
      catchHandler(res, error);
    }
  },
};
