"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LaptopLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LaptopLike.init(
    {
      userId: DataTypes.INTEGER,
      laptopId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "LaptopLike",
    }
  );
  return LaptopLike;
};
