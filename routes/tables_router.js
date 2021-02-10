var express = require('express');
var router = express.Router();
const tables_controller = require('../controllers/tables_controller');

router.post('/', tables_controller.getAllTables);

router.post('/active', tables_controller.getAllActiveTables);

router.post('/available', tables_controller.getAllAvailableTables);

router.post('/new', tables_controller.newTable);

router.post('/:table_ID', tables_controller.getTableInfo);

router.put('/:table_ID', tables_controller.editTable);

router.patch('/:table_ID', tables_controller.deleteTable);

router.post('/order/:table_ID', tables_controller.assignOrderToTable);

module.exports = router;