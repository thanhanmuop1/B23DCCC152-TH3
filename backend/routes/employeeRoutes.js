const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Routes cho quản lý nhân viên
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
