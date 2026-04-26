require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const monitoringService = require('./services/monitoring');

// Import routes
const authRoutes = require('./routes/auth');
const deploymentRoutes = require('./routes/deployments');
const monitoringRoutes = require('./routes/monitoring');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/deployments', deploymentRoutes);
app.use('/api/monitoring', monitoringRoutes);

// Synchroniser la base de données
sequelize.sync({ alter: true }).then(async () => {
  console.log('✅ Database synchronized');
  
  // Créer un utilisateur admin par défaut
  const User = require('./models/User');
  const adminExists = await User.findOne({ where: { email: 'admin@bunec.cm' } });
  
  if (!adminExists) {
    await User.create({
      email: 'admin@bunec.cm',
      password: 'ChangeMe123!',
      role: 'admin'
    });
    console.log('✅ Admin user created: admin@bunec.cm / ChangeMe123!');
  }
  
  // Démarrer le monitoring
  const Deployment = require('./models/Deployment');
  const vms = await Deployment.findAll({ where: { status: 'success' } });
  if (vms.length > 0) {
    monitoringService.startMonitoring(vms);
    console.log(`✅ Monitoring started for ${vms.length} VMs`);
  }

  app.get('/', (reg, res) => {
    res.send('Le serveur est Operationnel !');
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

});