const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Deployment = sequelize.define('Deployment', {
  vm_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ip_address: DataTypes.STRING,
  service_name: DataTypes.STRING,
  zone: DataTypes.ENUM('LAN', 'DMZ', 'MGMT', 'WAN'),
  status: {
    type: DataTypes.ENUM('pending', 'running', 'success', 'failed'),
    defaultValue: 'pending'
  },
  terraform_state: DataTypes.TEXT,
  deployment_logs: DataTypes.TEXT,
  created_by: DataTypes.INTEGER
});

module.exports = Deployment;