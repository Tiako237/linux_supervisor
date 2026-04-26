const express = require('express');
const Deployment = require('../models/Deployment');
const { authMiddleware } = require('../middleware/auth');
const terraformService = require('../services/terraform');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { vm_name, service_type, zone, specs } = req.body;
    
    const deployment = await Deployment.create({
      vm_name,
      service_name: service_type,
      zone,
      status: 'pending',
      created_by: req.user.id
    });
    
    // Lancer le déploiement Terraform en arrière-plan
    terraformService.deploy(deployment.id, {
      vm_name,
      service_type,
      zone,
      specs
    }).catch(err => console.error(err));
    
    res.json(deployment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const deployments = await Deployment.findAll({
      order: [['createdAt', 'DESC']],
      limit: 100
    });
    res.json(deployments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;