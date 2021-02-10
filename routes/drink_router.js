var express = require('express');
var router = express.Router();
const drink_controller = require('../controllers/drink_controller');

router.post('/', drink_controller.getAllDrinks);

router.post('/NOTConfirmed', drink_controller.getAllNOTConfirmedDrinks);

router.post('/confirmed', drink_controller.getAllConfirmedDrinks);

router.post('/served', drink_controller.getAllServedDrinks);

router.post('/search', drink_controller.searchDrink)

router.post('/add', drink_controller.addDrink);

router.post('/:drink_ID', drink_controller.getDrinkInfo);

router.put('/:drink_ID', drink_controller.editDrink);

router.patch('/:drink_ID', drink_controller.removeDrink);

router.post('/update/:drink_ID', drink_controller.updateDrinkState);

router.post('/paid/:drink_ID', drink_controller.setDrinkPaid);

module.exports = router;