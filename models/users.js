"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasOne(models.Profile, { as: "profile", foreignKey: "userId" });
      Users.belongsToMany(models.Laptop, { as: "likedLaptops", through: "LaptopLike" });
    }
  }
  Users.init(
    {
      name: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Users",
      paranoid: true,
      timestamps: true,
      freezeTableName: true,
    }
  );
  return Users;
};
