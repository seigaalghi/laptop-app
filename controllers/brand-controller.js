const Joi = require("joi");
const { Brand, Laptop } = require("../models");
const catchHandler = require("../utils/catch-handler");
const { Op } = require("sequelize");
const moment = require("moment");

const brandController = {
  createBrand: async (req, res) => {
    const body = req.body;
    try {
      const schema = Joi.object({
        name: Joi.string().required(),
        year: Joi.number().required(),
        city: Joi.string().required(),
      });

      const { error } = schema.validate(body);
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
          result: {},
        });
      }

      const brand = await Brand.create(body);

      if (!brand) {
        return res.status(500).json({
          status: "Internal Server Error",
          message: "Failed to save the data to database",
          result: {},
        });
      }

      res.status(201).json({
        status: "success",
        message: "Successfuly save the data",
        result: brand,
      });
    } catch (error) {
      catchHandler(res, error);
    }
  },
  getBrands: async (req, res) => {
    const { order, date, category, keyword } = req.query;
    try {
      let sort;
      switch (order) {
        case "terlama":
          sort = ["createdAt", "ASC"];
          break;
        default:
          sort = ["createdAt", "DESC"];
      }
      let dateRange;
      let first, last;
      switch (date) {
        case "day":
          first = moment().startOf("day").toDate();
          last = moment().endOf("day").toDate();
          dateRange = {
            createdAt: {
              [Op.between]: [first, last],
            },
          };
          break;
        case "week":
          first = moment().startOf("week").toDate();
          last = moment().endOf("week").toDate();
          dateRange = {
            createdAt: {
              [Op.between]: [first, last],
            },
          };
          break;
        case "month":
          first = moment().startOf("month").toDate();
          last = moment().endOf("month").toDate();
          dateRange = {
            createdAt: {
              [Op.between]: [first, last],
            },
          };
          break;
      }

      let search;
      if (keyword) {
        search = {
          [Op.or]: [
            {
              name: {
                [Op.like]: `%${keyword}%`,
              },
            },
            {
              city: {
                [Op.like]: `%${keyword}%`,
              },
            },
          ],
        };
      }

      let categoryQuery;

      if (category) {
        categoryQuery = {
          name: category,
        };
      }

      const brands = await Brand.findAll({
        limit: 10,
        order: [sort],
        include: [
          {
            model: Laptop,
            as: "laptops",
            attributes: ["name", "price", "stock"],
          },
        ],
        where: {
          ...dateRange,
          ...categoryQuery,
          ...search,
        },
      });
      if (brands.length == 0) {
        return res.status(404).json({
          status: "Data Not Found",
          message: "The data is empty",
          result: [],
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Successfuly retrieve the data",
        result: brands,
      });
    } catch (error) {
      catchHandler(res, error);
    }
  },
  getBrand: async (req, res) => {
    const { brandId: id } = req.params;
    try {
      const brand = await Brand.findOne({
        where: {
          id,
        },
      });

      if (!brand) {
        return res.status(404).json({
          status: "Data Not Found",
          message: "Cannot find a brand with id of " + id,
          result: {},
        });
      }
      res.status(200).json({
        status: "success",
        message: "Successfuly retrive the brand",
        result: brand,
      });
    } catch (error) {
      catchHandler(res, error);
    }
  },
  updateBrand: async (req, res) => {
    const { brandId } = req.params;
    const body = req.body;
    try {
      const schema = Joi.object({
        name: Joi.string(),
        year: Joi.number(),
        city: Joi.string(),
      });

      const { error } = schema.validate(body);

      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
          result: {},
        });
      }

      const checkUpdate = await Brand.update(body, {
        where: {
          id: brandId,
        },
      });

      if (checkUpdate[0] != 1) {
        return res.status(404).json({
          status: "Not Found",
          message: "Failed to update the data / data not found",
          result: {},
        });
      }

      const brand = await Brand.findByPk(brandId);

      res.status(200).json({
        status: "success",
        message: "Successfuly update the data",
        result: brand,
      });
    } catch (error) {
      catchHandler(res, error);
    }
  },
  deleteBrand: async (req, res) => {
    const { brandId } = req.params;
    try {
      const brand = await Brand.destroy({
        where: {
          id: brandId,
        },
      });
      if (!brand) {
        return res.status(404).json({
          status: "Data Not Found",
          message: "The data that you want to delete is not exist",
          result: {},
        });
      }
      res.status(200).json({
        status: "success",
        message: "Successfuly delete the data",
        result: {},
      });
    } catch (error) {
      catchHandler(res, error);
    }
  },
};

module.exports = brandController;
