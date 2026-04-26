const express = require('express');
const Monitoring = require('../models/Monitoring');
const Alert = require('../models/Alert');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/vms', authMiddleware, async (req, res) => {
  try {
    const stats = await Monitoring.findAll({
      order: [['last_check', 'DESC']],
      limit: 50
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/alerts', authMiddleware, async (req, res) => {
  try {
    const alerts = await Alert.findAll({
      where: { resolved: false },
      order: [['createdAt', 'DESC']]
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;