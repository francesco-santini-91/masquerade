var express = require('express');
var router = express.Router();
const dishes_controller = require('../controllers/dishes_menu_controller');

router.post('/', dishes_controller.getAllDishes);

router.post('/available', dishes_controller.getAllAvailableDishes);

router.post('/NOTAvailable', dishes_controller.getAllNOTAvailableDishes);

router.post('/search', dishes_controller.searchDish);

router.post('/add', dishes_controller.addDish);

router.post('/incrementOrders', dishes_controller.incrementOrdersNumber);

router.post('/:type', dishes_controller.getDishesByType);

router.post('/:dish_ID', dishes_controller.getDishInfo);

router.put('/:dish_ID', dishes_controller.editDish);

router.patch('/:dish_ID', dishes_controller.removeDish);

router.post('/setAvailability/:dish_ID', dishes_controller.setAvailability);

router.post('/setItIsNew/:dish_ID', dishes_controller.setItIsNew);

module.exports = router;