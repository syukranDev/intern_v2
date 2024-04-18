'use strict'

const Sequelize = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialectOptions: {
      useUTC: true
    },
    pool: {
      max: 300,
      min: 10,
      idle: 600000
    },
    logging: false,
    alter: false
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// public schema
db.inventory = require('./inventory.js')(sequelize, Sequelize);

sequelize.sync();

module.exports = db;