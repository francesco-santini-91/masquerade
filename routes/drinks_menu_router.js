var express = require('express');
var router = express.Router();
const drinks_controller = require('../controllers/drinks_menu_controller');

router.post('/', drinks_controller.getAllDrinks);

router.post('/available', drinks_controller.getAllAvailableDrinks);

router.post('/NOTAvailable', drinks_controller.getAllNOTAvailableDrinks);

router.post('/search', drinks_controller.searchDrink);

router.post('/add', drinks_controller.addDrink);

router.post('/incrementOrders', drinks_controller.incrementOrdersNumber);

router.post('/:drink_ID', drinks_controller.getDrinkInfo);

router.put('/:drink_ID', drinks_controller.editDrink);

router.patch('/:drink_ID', drinks_controller.removeDrink);

router.post('/types/:type', drinks_controller.getDrinksByType);

router.post('/setAvailability/:drink_ID', drinks_controller.setAvailability);

module.exports = router;