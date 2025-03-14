const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Routes cho quản lý dịch vụ
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.post('/', serviceController.createService);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);
router.get('/:id/employees', serviceController.getServiceEmployees);

module.exports = router; 