"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        notEmpty: {
          msg: "Username should not be empty"
        },
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        isEmail: {
          msg: "Email is not valid"
        },
        notEmpty: {
          msg: "Email should not empty"
        },
        isUnique: async (value, next) => {
          try {
            const user = await User.find({
              email: value
            });
            if (user) {
              next("Email already in use");
            } else {
              next();
            }
          } catch (err) {
            return next();
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        notEmpty: {
          msg: "Password should not be empty",
        },
        allowNull: false
      },
      joinDate: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      timestamps: false
    }
  );
  User.associate = function(models) {
    User.hasMany(models.Reservation);
  };
  return User;
};
