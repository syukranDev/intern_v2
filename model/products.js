module.exports = (sequelize, Sequelize) => {
  const Products = sequelize.define('products', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    origin_country: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    price: {
      type: Sequelize.NUMERIC,
      allowNull: true
    },
    expiry_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    status: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    created_by: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    updated_by: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  });
  return Products;
};
