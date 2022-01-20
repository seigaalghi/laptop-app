'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Laptop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Laptop.belongsTo(models.Brand, {as : "brand", foreignKey: "brandId"})
      Laptop.belongsToMany(models.Users, {as : "likes", through : models.LaptopLike})
    }
  };
  Laptop.init({
    brandId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
    stock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Laptop',
  });
  return Laptop;
};