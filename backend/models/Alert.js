const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alert = sequelize.define('Alert', {
  vm_id: DataTypes.INTEGER,
  severity: {
    type: DataTypes.ENUM('info', 'warning', 'critical'),
    defaultValue: 'info'
  },
  source: DataTypes.STRING,
  message: DataTypes.TEXT,
  resolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  resolved_at: DataTypes.DATE
});

module.exports = Alert;