"use strict";
module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define(
    "Reservation",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: {
          msg: "Name should not be empty"
        }
      },
      hotelName: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: {
          msg: "Hotel name should not be empty"
        }
      },
      arrivalDate: {
        type: DataTypes.DATE,
        allowNull: false,
        notEmpty: {
          msg: "Arrival date should not be empty"
        }
      },
      departureDate: {
        type: DataTypes.DATE,
        allowNull: false,
        notEmpty: {
          msg: "Departure date should not be empty"
        }
      }
    },
    {
      freezeTableName: true
    }
  );
  Reservation.associate = function(models) {
    Reservation.belongsTo(models.User);
  };
  return Reservation;
};
