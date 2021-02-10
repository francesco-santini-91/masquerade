var express = require('express');
var router = express.Router();
const ingredients_controller = require('../controllers/ingredients_controller');

router.post('/', ingredients_controller.getAllIngredients);

router.post('/available', ingredients_controller.getAllAvailableIngredients);

router.post('/NOTAvailable', ingredients_controller.getAllNOTAvailableIngredients);

router.post('/add', ingredients_controller.addIngredient);

router.post('/search', ingredients_controller.searchIngredient);

router.post('/:ingredient_ID', ingredients_controller.getIngredientInfo);

router.put('/:ingredient_ID', ingredients_controller.editIngredient);

router.patch('/:ingredient_ID', ingredients_controller.removeIngredient);

router.post('/types/:type', ingredients_controller.getIngredientsByType);

router.post('/setAvailability/:ingredient_ID', ingredients_controller.setAvailability);

module.exports = router;