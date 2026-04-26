const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Monitoring = sequelize.define('Monitoring', {
  vm_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cpu_usage: DataTypes.FLOAT,
  ram_usage: DataTypes.FLOAT,
  disk_usage: DataTypes.FLOAT,
  services_status: DataTypes.JSONB,
  uptime: DataTypes.INTEGER,
  last_check: DataTypes.DATE
});

module.exports = Monitoring;