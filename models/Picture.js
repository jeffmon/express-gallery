module.exports = function(sequelize, DataTypes) {
  var Pictures = sequelize.define("Picture", {
    Author: DataTypes.STRING,
    link: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });

  return Pictures;
};
