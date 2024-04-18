module.exports = (sequelize, Sequelize) => {
    var Transactions = sequelize.define('inventory', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      desc: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      type:{
        type: Sequelize.TEXT,
        allowNull: false
      },
      quantity:{
        type: Sequelize.REAL,
        allowNull: false
      }, 
      status:{
        type: Sequelize.TEXT,
        allowNull: false
      },
      created_by:{
        type: Sequelize.TEXT,
        allowNull: true
      },
      updated_by:{
        type: Sequelize.TEXT,
        allowNull: true
      }
    },{
      timestamps: true,
      // underscored: true,
      freezeTableName: true
    });
    return Transactions;
  }