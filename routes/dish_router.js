var express = require('express');
var router = express.Router();
const dish_controller = require('../controllers/dish_controller');

router.post('/', dish_controller.getAllDishes);

router.post('/NOTConfirmed', dish_controller.getAllNOTConfirmedDishes);

router.post('/confirmed', dish_controller.getAllConfirmedDishes);

router.post('/served', dish_controller.getAllServedDishes);

router.post('/search', dish_controller.searchDish);

router.post('/add', dish_controller.addDish);

router.post('/:dish_ID', dish_controller.getDishInfo);

router.put('/:dish_ID', dish_controller.editDish);

router.patch('/:dish_ID', dish_controller.removeDish);

router.post('/update/:dish_ID', dish_controller.updateDishState);

router.post('/paid/:dish_ID', dish_controller.setDishPaid);

module.exports = router;